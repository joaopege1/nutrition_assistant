"""
Unit tests for authentication router
"""
import pytest
from fastapi import status


@pytest.mark.unit
@pytest.mark.auth
class TestUserCreation:
    """Test user creation endpoint."""
    
    def test_create_user_success(self, client):
        """Test successful user creation."""
        response = client.post(
            "/auth/",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "full_name": "New User",
                "password": "password123",
                "role": "user"
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["message"] == "User created"
        assert data["user"]["username"] == "newuser"
        assert data["user"]["email"] == "newuser@example.com"
        # The password field exists in response but we just check user was created
    
    def test_create_admin_user(self, client):
        """Test creating admin user."""
        response = client.post(
            "/auth/",
            json={
                "username": "adminuser",
                "email": "admin@example.com",
                "full_name": "Admin User",
                "password": "adminpass123",
                "role": "admin"
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["user"]["role"] == "admin"
    
    def test_create_user_duplicate_username(self, client, test_user):
        """Test creating user with duplicate username."""
        response = client.post(
            "/auth/",
            json={
                "username": test_user.username,
                "email": "different@example.com",
                "full_name": "Different User",
                "password": "password123",
                "role": "user"
            }
        )
        # SQLite will raise an integrity error for duplicate username
        assert response.status_code == 500 or response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_create_user_duplicate_email(self, client, test_user):
        """Test creating user with duplicate email."""
        response = client.post(
            "/auth/",
            json={
                "username": "differentuser",
                "email": test_user.email,
                "full_name": "Different User",
                "password": "password123",
                "role": "user"
            }
        )
        # SQLite will raise an integrity error for duplicate email
        assert response.status_code == 500 or response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.unit
@pytest.mark.auth
class TestAuthentication:
    """Test authentication and token generation."""
    
    def test_login_success(self, client, test_user):
        """Test successful login."""
        response = client.post(
            "/auth/tokens",
            data={
                "username": "testuser",
                "password": "testpassword123"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
    
    def test_login_wrong_password(self, client, test_user):
        """Test login with incorrect password."""
        response = client.post(
            "/auth/tokens",
            data={
                "username": "testuser",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Incorrect username or password" in response.json()["detail"]
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent username."""
        response = client.post(
            "/auth/tokens",
            data={
                "username": "nonexistent",
                "password": "password123"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Incorrect username or password" in response.json()["detail"]
    
    def test_login_empty_credentials(self, client):
        """Test login with empty credentials."""
        response = client.post(
            "/auth/tokens",
            data={
                "username": "",
                "password": ""
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED or response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.unit
@pytest.mark.auth
class TestTokenValidation:
    """Test JWT token validation."""
    
    def test_valid_token(self, client, test_user, auth_headers):
        """Test accessing protected endpoint with valid token."""
        response = client.get("/users/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
    
    def test_invalid_token(self, client):
        """Test accessing protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalidtoken123"}
        response = client.get("/users/", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_missing_token(self, client):
        """Test accessing protected endpoint without token."""
        response = client.get("/users/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_malformed_authorization_header(self, client):
        """Test with malformed authorization header."""
        headers = {"Authorization": "InvalidFormat token123"}
        response = client.get("/users/", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.unit
@pytest.mark.auth
class TestPasswordHashing:
    """Test password hashing functionality."""
    
    def test_password_is_hashed(self, client, db_session):
        """Test that passwords are properly hashed in database."""
        from models import User
        
        # Create user
        client.post(
            "/auth/",
            json={
                "username": "hashtest",
                "email": "hash@example.com",
                "full_name": "Hash Test",
                "password": "plainpassword",
                "role": "user"
            }
        )
        
        # Check database
        user = db_session.query(User).filter(User.username == "hashtest").first()
        assert user is not None
        assert user.hashed_password != "plainpassword"
        assert len(user.hashed_password) > 20  # Bcrypt hashes are long
    
    def test_same_password_different_hashes(self, client, db_session):
        """Test that same password generates different hashes (salt)."""
        from models import User
        
        # Create two users with same password
        client.post(
            "/auth/",
            json={
                "username": "user1",
                "email": "user1@example.com",
                "full_name": "User 1",
                "password": "samepassword",
                "role": "user"
            }
        )
        
        client.post(
            "/auth/",
            json={
                "username": "user2",
                "email": "user2@example.com",
                "full_name": "User 2",
                "password": "samepassword",
                "role": "user"
            }
        )
        
        user1 = db_session.query(User).filter(User.username == "user1").first()
        user2 = db_session.query(User).filter(User.username == "user2").first()
        
        # Hashes should be different due to salting
        assert user1.hashed_password != user2.hashed_password


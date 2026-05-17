"""
Unit tests for users router
"""
import pytest
from fastapi import status


@pytest.mark.unit
@pytest.mark.users
class TestGetUser:
    """Test getting user information."""
    
    def test_get_user_authenticated(self, client, test_user, auth_headers):
        """Test getting user info when authenticated."""
        response = client.get("/users/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["username"] == test_user.username
        assert data["email"] == test_user.email
        assert data["full_name"] == test_user.full_name
        assert data["role"] == test_user.role
        assert "hashed_password" in data  # Raw model includes this
    
    def test_get_user_unauthenticated(self, client):
        """Test getting user info without authentication."""
        response = client.get("/users/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_user_invalid_token(self, client):
        """Test getting user info with invalid token."""
        headers = {"Authorization": "Bearer invalidtoken"}
        response = client.get("/users/", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.unit
@pytest.mark.users
class TestChangePassword:
    """Test password change functionality."""
    
    def test_change_password_success(self, client, test_user, auth_headers, db_session):
        """Password is actually updated to the new value."""
        from models import User
        from routers.auth import bcrypt_context

        response = client.put(
            "/users/password",
            json={"password": "testpassword123", "new_password": "brand-new-pass-456"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT

        db_session.expire_all()
        updated = db_session.query(User).filter(User.id == test_user.id).first()
        assert bcrypt_context.verify("brand-new-pass-456", updated.hashed_password)
        assert not bcrypt_context.verify("testpassword123", updated.hashed_password)

    def test_change_password_wrong_current_password(self, client, auth_headers):
        """Test changing password with wrong current password."""
        response = client.put(
            "/users/password",
            json={"password": "wrongpassword", "new_password": "brand-new-pass-456"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_change_password_same_as_current(self, client, auth_headers):
        """Reject reusing the same password."""
        response = client.put(
            "/users/password",
            json={"password": "testpassword123", "new_password": "testpassword123"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_change_password_unauthenticated(self, client):
        """Test changing password without authentication."""
        response = client.put(
            "/users/password",
            json={"password": "testpassword123", "new_password": "brand-new-pass-456"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_change_password_too_short(self, client, auth_headers):
        """new_password must be at least 8 characters."""
        response = client.put(
            "/users/password",
            json={"password": "testpassword123", "new_password": "1234567"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_change_password_missing_new_password(self, client, auth_headers):
        """Test changing password without new_password."""
        response = client.put(
            "/users/password",
            json={"password": "testpassword123"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.unit
@pytest.mark.users
class TestUserProfile:
    """Test user profile related functionality."""
    
    def test_user_has_correct_role(self, client, test_user, auth_headers):
        """Test that user has correct role."""
        response = client.get("/users/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["role"] == "user"
    
    def test_admin_has_correct_role(self, client, test_admin, admin_headers):
        """Test that admin has correct role."""
        response = client.get("/users/", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["role"] == "admin"
    
    def test_user_is_active(self, client, test_user, auth_headers):
        """Test that user is active."""
        response = client.get("/users/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["is_active"] is True


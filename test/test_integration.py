"""
Integration tests for complete workflows
"""
import pytest
from fastapi import status
from datetime import datetime


@pytest.mark.integration
class TestUserRegistrationAndLogin:
    """Test complete user registration and login workflow."""
    
    def test_complete_user_signup_and_login_flow(self, client):
        """Test user can signup and then login."""
        # Step 1: Create a new user
        signup_data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "securepassword123",
            "role": "user"
        }
        
        signup_response = client.post("/auth/", json=signup_data)
        assert signup_response.status_code == status.HTTP_201_CREATED
        
        # Step 2: Login with the new user
        login_response = client.post(
            "/auth/tokens",
            data={
                "username": "newuser",
                "password": "securepassword123"
            }
        )
        assert login_response.status_code == status.HTTP_200_OK
        token_data = login_response.json()
        assert "access_token" in token_data
        
        # Step 3: Access protected endpoint with token
        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        user_response = client.get("/users/", headers=headers)
        assert user_response.status_code == status.HTTP_200_OK
        user_data = user_response.json()
        assert user_data["username"] == "newuser"
        assert user_data["email"] == "newuser@example.com"


@pytest.mark.integration
class TestFoodEntryWorkflow:
    """Test complete food entry CRUD workflow."""
    
    def test_complete_food_entry_crud(self, client, test_user, auth_headers):
        """Test creating, reading, updating, and deleting food entries."""
        # Step 1: Create a food entry
        entry_data = {
            "user": test_user.username,
            "food": "Strawberry",
            "quantity": 10,
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        create_response = client.post("/food_entry/", json=entry_data, headers=auth_headers)
        assert create_response.status_code == status.HTTP_201_CREATED
        
        # Step 2: Read the food entries
        read_response = client.get("/foods/", headers=auth_headers)
        assert read_response.status_code == status.HTTP_200_OK
        entries = read_response.json()
        assert len(entries) >= 1
        
        # Find our entry
        entry_id = None
        for entry in entries:
            if entry["food"] == "Strawberry":
                entry_id = entry["id"]
                break
        
        assert entry_id is not None
        
        # Step 3: Update the food entry
        update_data = {
            "user": test_user.username,
            "food": "Strawberry",
            "quantity": 15,  # Updated quantity
            "is_safe": False,  # Updated safety
            "date": datetime.now().isoformat()
        }
        
        update_response = client.put(
            f"/food_entry/{entry_id}",
            json=update_data,
            headers=auth_headers
        )
        assert update_response.status_code == status.HTTP_200_OK
        
        # Step 4: Delete the food entry
        delete_response = client.delete(f"/food_entry/{entry_id}", headers=auth_headers)
        assert delete_response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]
        
        # Step 5: Verify deletion
        verify_response = client.get("/foods/", headers=auth_headers)
        verify_entries = verify_response.json()
        deleted = True
        for entry in verify_entries:
            if entry["id"] == entry_id:
                deleted = False
                break
        assert deleted is True


@pytest.mark.integration
class TestAdminUserManagement:
    """Test admin user management workflow."""
    
    def test_admin_manage_user_roles(self, client, test_admin, admin_headers):
        """Test admin creating users and managing their roles."""
        # Step 1: Admin creates a regular user
        user_data = {
            "username": "manageduser",
            "email": "managed@example.com",
            "full_name": "Managed User",
            "password": "password123",
            "role": "user"
        }
        
        create_response = client.post("/auth/", json=user_data)
        assert create_response.status_code == status.HTTP_201_CREATED
        
        # Step 2: Admin gets all users
        users_response = client.get("/auth/admin/users/", headers=admin_headers)
        assert users_response.status_code == status.HTTP_200_OK
        users = users_response.json()
        
        # Find the managed user
        managed_user = None
        for user in users:
            if user["username"] == "manageduser":
                managed_user = user
                break
        
        assert managed_user is not None
        assert managed_user["role"] == "user"
        
        # Step 3: Admin promotes user to admin
        promote_response = client.put(
            f"/auth/admin/users/{managed_user['id']}/role",
            json={"role": "admin"},
            headers=admin_headers
        )
        assert promote_response.status_code == status.HTTP_200_OK
        promoted_user = promote_response.json()["user"]
        assert promoted_user["role"] == "admin"
        
        # Step 4: Admin demotes user back to regular user
        demote_response = client.put(
            f"/auth/admin/users/{managed_user['id']}/role",
            json={"role": "user"},
            headers=admin_headers
        )
        assert demote_response.status_code == status.HTTP_200_OK
        demoted_user = demote_response.json()["user"]
        assert demoted_user["role"] == "user"


@pytest.mark.integration
class TestAdminFoodModeration:
    """Test admin food entry moderation workflow."""
    
    def test_admin_moderate_user_food_entries(self, client, test_user, test_admin, auth_headers, admin_headers):
        """Test admin reviewing and moderating user food entries."""
        # Step 1: User creates food entries
        entries_data = [
            {
                "user": test_user.username,
                "food": "Chocolate",
                "quantity": 5,
                "is_safe": True,
                "date": datetime.now().isoformat()
            },
            {
                "user": test_user.username,
                "food": "Peanuts",
                "quantity": 10,
                "is_safe": True,
                "date": datetime.now().isoformat()
            }
        ]
        
        for entry_data in entries_data:
            response = client.post("/food_entry/", json=entry_data, headers=auth_headers)
            assert response.status_code == status.HTTP_201_CREATED
        
        # Step 2: Admin gets all food entries
        all_entries_response = client.get("/auth/admin/foods/", headers=admin_headers)
        assert all_entries_response.status_code == status.HTTP_200_OK
        all_entries = all_entries_response.json()
        
        # Find entries
        chocolate_entry = None
        peanuts_entry = None
        for entry in all_entries:
            if entry["food"] == "Chocolate":
                chocolate_entry = entry
            elif entry["food"] == "Peanuts":
                peanuts_entry = entry
        
        assert chocolate_entry is not None
        assert peanuts_entry is not None
        
        # Step 3: Admin marks peanuts as unsafe
        update_response = client.put(
            f"/auth/admin/food_entry/{peanuts_entry['id']}?is_safe=false",
            headers=admin_headers
        )
        assert update_response.status_code == status.HTTP_200_OK
        updated_entry = update_response.json()["food_entry"]
        assert updated_entry["is_safe"] is False
        
        # Step 4: User checks their entries
        user_entries_response = client.get("/foods/", headers=auth_headers)
        user_entries = user_entries_response.json()
        
        for entry in user_entries:
            if entry["food"] == "Peanuts":
                assert entry["is_safe"] is False
            elif entry["food"] == "Chocolate":
                assert entry["is_safe"] is True


@pytest.mark.integration
class TestMultiUserScenario:
    """Test scenarios with multiple users interacting."""
    
    def test_users_cannot_see_each_others_entries(self, client):
        """Test that users can only see their own food entries."""
        # Create two users
        user1_data = {
            "username": "user1",
            "email": "user1@example.com",
            "full_name": "User One",
            "password": "password123",
            "role": "user"
        }
        
        user2_data = {
            "username": "user2",
            "email": "user2@example.com",
            "full_name": "User Two",
            "password": "password123",
            "role": "user"
        }
        
        client.post("/auth/", json=user1_data)
        client.post("/auth/", json=user2_data)
        
        # Login both users
        token1_response = client.post("/auth/tokens", data={"username": "user1", "password": "password123"})
        token1 = token1_response.json()["access_token"]
        headers1 = {"Authorization": f"Bearer {token1}"}
        
        token2_response = client.post("/auth/tokens", data={"username": "user2", "password": "password123"})
        token2 = token2_response.json()["access_token"]
        headers2 = {"Authorization": f"Bearer {token2}"}
        
        # User 1 creates food entries
        client.post(
            "/food_entry/",
            json={
                "user": "user1",
                "food": "User1Food",
                "quantity": 1,
                "is_safe": True,
                "date": datetime.now().isoformat()
            },
            headers=headers1
        )
        
        # User 2 creates food entries
        client.post(
            "/food_entry/",
            json={
                "user": "user2",
                "food": "User2Food",
                "quantity": 1,
                "is_safe": True,
                "date": datetime.now().isoformat()
            },
            headers=headers2
        )
        
        # User 1 gets their entries
        user1_entries = client.get("/foods/", headers=headers1).json()
        user1_foods = [entry["food"] for entry in user1_entries]
        assert "User1Food" in user1_foods
        assert "User2Food" not in user1_foods
        
        # User 2 gets their entries
        user2_entries = client.get("/foods/", headers=headers2).json()
        user2_foods = [entry["food"] for entry in user2_entries]
        assert "User2Food" in user2_foods
        assert "User1Food" not in user2_foods
    
    def test_user_cannot_modify_other_users_entries(self, client):
        """Test that users cannot modify other users' entries."""
        # Create two users
        user1_data = {
            "username": "user3",
            "email": "user3@example.com",
            "full_name": "User Three",
            "password": "password123",
            "role": "user"
        }
        
        user2_data = {
            "username": "user4",
            "email": "user4@example.com",
            "full_name": "User Four",
            "password": "password123",
            "role": "user"
        }
        
        client.post("/auth/", json=user1_data)
        client.post("/auth/", json=user2_data)
        
        # Login both users
        token1_response = client.post("/auth/tokens", data={"username": "user3", "password": "password123"})
        token1 = token1_response.json()["access_token"]
        headers1 = {"Authorization": f"Bearer {token1}"}
        
        token2_response = client.post("/auth/tokens", data={"username": "user4", "password": "password123"})
        token2 = token2_response.json()["access_token"]
        headers2 = {"Authorization": f"Bearer {token2}"}
        
        # User 1 creates a food entry
        create_response = client.post(
            "/food_entry/",
            json={
                "user": "user3",
                "food": "ProtectedFood",
                "quantity": 1,
                "is_safe": True,
                "date": datetime.now().isoformat()
            },
            headers=headers1
        )
        
        # Get the entry ID
        user1_entries = client.get("/foods/", headers=headers1).json()
        entry_id = None
        for entry in user1_entries:
            if entry["food"] == "ProtectedFood":
                entry_id = entry["id"]
                break
        
        assert entry_id is not None
        
        # User 2 tries to update User 1's entry
        update_response = client.put(
            f"/food_entry/{entry_id}",
            json={
                "user": "user4",
                "food": "HackedFood",
                "quantity": 999,
                "is_safe": False,
                "date": datetime.now().isoformat()
            },
            headers=headers2
        )
        assert update_response.status_code == status.HTTP_403_FORBIDDEN
        
        # User 2 tries to delete User 1's entry
        delete_response = client.delete(f"/food_entry/{entry_id}", headers=headers2)
        assert delete_response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.integration
class TestAuthenticationFlow:
    """Test various authentication flows."""
    
    def test_token_required_for_protected_endpoints(self, client, test_user):
        """Test that all protected endpoints require authentication."""
        protected_endpoints = [
            ("GET", "/users/"),
            ("GET", "/foods/"),
            ("GET", "/auth/admin/users/"),
            ("GET", "/auth/admin/foods/"),
        ]
        
        for method, endpoint in protected_endpoints:
            if method == "GET":
                response = client.get(endpoint)
            elif method == "POST":
                response = client.post(endpoint)
            elif method == "PUT":
                response = client.put(endpoint)
            elif method == "DELETE":
                response = client.delete(endpoint)
            
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_expired_or_invalid_token_rejected(self, client):
        """Test that invalid tokens are rejected."""
        invalid_headers = {"Authorization": "Bearer invalid_token_here"}
        
        response = client.get("/users/", headers=invalid_headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.integration
class TestDataValidation:
    """Test data validation across the application."""
    
    def test_invalid_food_entry_data_rejected(self, client, auth_headers):
        """Test that invalid food entry data is rejected."""
        invalid_entries = [
            # Negative quantity
            {
                "user": "test",
                "food": "Apple",
                "quantity": -1,
                "is_safe": True,
                "date": datetime.now().isoformat()
            },
            # Zero quantity
            {
                "user": "test",
                "food": "Apple",
                "quantity": 0,
                "is_safe": True,
                "date": datetime.now().isoformat()
            },
            # Missing required fields
            {
                "food": "Apple",
                "quantity": 5
            }
        ]
        
        for invalid_entry in invalid_entries:
            response = client.post("/food_entry/", json=invalid_entry, headers=auth_headers)
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


"""
Unit tests for admin router
"""
import pytest
from fastapi import status
from datetime import datetime


@pytest.mark.unit
@pytest.mark.admin
class TestAdminGetAllFoodEntries:
    """Test admin getting all food entries."""
    
    def test_admin_get_all_food_entries(self, client, test_admin, admin_headers, multiple_food_entries):
        """Test admin can get all food entries."""
        response = client.get("/auth/admin/foods/", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5  # 3 user entries + 2 admin entries
    
    def test_user_cannot_get_all_food_entries(self, client, test_user, auth_headers, multiple_food_entries):
        """Test regular user cannot access admin endpoint."""
        response = client.get("/auth/admin/foods/", headers=auth_headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "permission" in response.json()["detail"].lower()
    
    def test_unauthenticated_cannot_get_all_food_entries(self, client):
        """Test unauthenticated user cannot access admin endpoint."""
        response = client.get("/auth/admin/foods/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.unit
@pytest.mark.admin
class TestAdminDeleteFoodEntry:
    """Test admin deleting food entries."""
    
    def test_admin_delete_any_food_entry(self, client, test_admin, admin_headers, sample_food_entry):
        """Test admin can delete any food entry."""
        response = client.delete(
            f"/auth/admin/food_entry/{sample_food_entry.id}",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT or response.status_code == status.HTTP_200_OK
    
    def test_admin_delete_nonexistent_entry(self, client, admin_headers):
        """Test admin deleting non-existent entry."""
        response = client.delete(
            "/auth/admin/food_entry/99999",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_user_cannot_admin_delete(self, client, test_user, auth_headers, sample_food_entry):
        """Test regular user cannot use admin delete endpoint."""
        response = client.delete(
            f"/auth/admin/food_entry/{sample_food_entry.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.unit
@pytest.mark.admin
class TestAdminUpdateFoodEntry:
    """Test admin updating food entries."""
    
    def test_admin_update_food_safety(self, client, test_admin, admin_headers, sample_food_entry):
        """Test admin updating food entry safety status."""
        response = client.put(
            f"/auth/admin/food_entry/{sample_food_entry.id}?is_safe=false",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Food entry updated"
        assert data["food_entry"]["is_safe"] is False
    
    def test_admin_update_safety_to_true(self, client, test_admin, admin_headers, db_session):
        """Test admin updating food entry to safe."""
        from models import FoodEntry
        
        # Create unsafe entry
        unsafe_entry = FoodEntry(
            user=test_admin.username,
            food="UnsafeFood",
            quantity=1,
            is_safe=False,
            date=datetime.now(),
            owner_id=test_admin.id
        )
        db_session.add(unsafe_entry)
        db_session.commit()
        db_session.refresh(unsafe_entry)
        
        response = client.put(
            f"/auth/admin/food_entry/{unsafe_entry.id}?is_safe=true",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["food_entry"]["is_safe"] is True
    
    def test_admin_update_nonexistent_entry(self, client, admin_headers):
        """Test admin updating non-existent entry."""
        response = client.put(
            "/auth/admin/food_entry/99999?is_safe=true",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_user_cannot_admin_update(self, client, test_user, auth_headers, sample_food_entry):
        """Test regular user cannot use admin update endpoint."""
        response = client.put(
            f"/auth/admin/food_entry/{sample_food_entry.id}?is_safe=false",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.unit
@pytest.mark.admin
class TestAdminGetAllUsers:
    """Test admin getting all users."""
    
    def test_admin_get_all_users(self, client, test_admin, admin_headers, test_user):
        """Test admin can get all users."""
        response = client.get("/auth/admin/users/", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2  # At least test_user and test_admin
        
        usernames = [user["username"] for user in data]
        assert "testuser" in usernames
        assert "adminuser" in usernames
    
    def test_user_cannot_get_all_users(self, client, test_user, auth_headers):
        """Test regular user cannot get all users."""
        response = client.get("/auth/admin/users/", headers=auth_headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_unauthenticated_cannot_get_all_users(self, client):
        """Test unauthenticated user cannot get all users."""
        response = client.get("/auth/admin/users/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.unit
@pytest.mark.admin
class TestAdminUpdateUserRole:
    """Test admin updating user roles."""
    
    def test_admin_promote_user_to_admin(self, client, test_admin, admin_headers, test_user):
        """Test admin promoting user to admin role."""
        response = client.put(
            f"/auth/admin/users/{test_user.id}/role",
            json={"role": "admin"},
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "User role updated successfully"
        assert data["user"]["role"] == "admin"
        assert data["user"]["username"] == test_user.username
    
    def test_admin_demote_admin_to_user(self, client, test_admin, admin_headers, db_session):
        """Test admin demoting admin to user role."""
        from models import User
        from routers.auth import bcrypt_context
        
        # Create another admin to demote
        another_admin = User(
            username="anotheradmin",
            email="another@admin.com",
            full_name="Another Admin",
            hashed_password=bcrypt_context.hash("password123"),
            role="admin",
            is_active=True
        )
        db_session.add(another_admin)
        db_session.commit()
        db_session.refresh(another_admin)
        
        response = client.put(
            f"/auth/admin/users/{another_admin.id}/role",
            json={"role": "user"},
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["user"]["role"] == "user"
    
    def test_admin_update_invalid_role(self, client, test_admin, admin_headers, test_user):
        """Test admin updating user with invalid role."""
        response = client.put(
            f"/auth/admin/users/{test_user.id}/role",
            json={"role": "superadmin"},  # Invalid role
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid role" in response.json()["detail"]
    
    def test_admin_update_nonexistent_user(self, client, admin_headers):
        """Test admin updating role of non-existent user."""
        response = client.put(
            "/auth/admin/users/99999/role",
            json={"role": "admin"},
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "User not found" in response.json()["detail"]
    
    def test_user_cannot_update_roles(self, client, test_user, auth_headers, db_session):
        """Test regular user cannot update roles."""
        from models import User
        from routers.auth import bcrypt_context
        
        # Create another user
        another_user = User(
            username="anotheruser",
            email="another@user.com",
            full_name="Another User",
            hashed_password=bcrypt_context.hash("password123"),
            role="user",
            is_active=True
        )
        db_session.add(another_user)
        db_session.commit()
        db_session.refresh(another_user)
        
        response = client.put(
            f"/auth/admin/users/{another_user.id}/role",
            json={"role": "admin"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_unauthenticated_cannot_update_roles(self, client, test_user):
        """Test unauthenticated user cannot update roles."""
        response = client.put(
            f"/auth/admin/users/{test_user.id}/role",
            json={"role": "admin"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.unit
@pytest.mark.admin
class TestAdminAuthorization:
    """Test admin authorization and permissions."""
    
    def test_admin_has_admin_role(self, client, test_admin, admin_headers):
        """Test admin user has admin role."""
        response = client.get("/users/", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["role"] == "admin"
    
    def test_regular_user_has_user_role(self, client, test_user, auth_headers):
        """Test regular user has user role."""
        response = client.get("/users/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["role"] == "user"


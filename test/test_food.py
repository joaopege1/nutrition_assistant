"""
Unit tests for food entry router
"""
import pytest
from fastapi import status
from datetime import datetime


@pytest.mark.unit
@pytest.mark.food
class TestGetFoodEntries:
    """Test retrieving food entries."""
    
    def test_get_food_entries_authenticated(self, client, test_user, auth_headers, sample_food_entry):
        """Test getting food entries as authenticated user."""
        response = client.get("/foods/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["food"] == "Apple"
    
    def test_get_food_entries_unauthenticated(self, client):
        """Test getting food entries without authentication."""
        response = client.get("/foods/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_user_sees_only_own_entries(self, client, test_user, auth_headers, multiple_food_entries):
        """Test that regular user sees only their own entries."""
        response = client.get("/foods/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # User should see only their 3 entries, not admin's 2 entries
        assert len(data) == 3
        for entry in data:
            assert entry["owner_id"] == test_user.id
    
    def test_admin_sees_all_entries(self, client, test_admin, admin_headers, multiple_food_entries):
        """Test that admin sees all entries."""
        response = client.get("/foods/", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Admin should see all 5 entries (3 user + 2 admin)
        assert len(data) == 5


@pytest.mark.unit
@pytest.mark.food
class TestCreateFoodEntry:
    """Test creating food entries."""
    
    def test_create_food_entry_success(self, client, test_user, auth_headers):
        """Test successfully creating a food entry."""
        entry_data = {
            "user": "testuser",
            "food": "Banana",
            "quantity": 3,
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        response = client.post("/food_entry/", json=entry_data, headers=auth_headers)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["message"] == "Food entry created"
        assert data["food_entry"]["food"] == "Banana"
        assert data["food_entry"]["quantity"] == 3
    
    def test_create_food_entry_unauthenticated(self, client):
        """Test creating food entry without authentication."""
        entry_data = {
            "user": "testuser",
            "food": "Banana",
            "quantity": 3,
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        response = client.post("/food_entry/", json=entry_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_food_entry_invalid_quantity(self, client, auth_headers):
        """Test creating food entry with invalid quantity (must be > 0)."""
        entry_data = {
            "user": "testuser",
            "food": "Banana",
            "quantity": 0,  # Invalid: must be > 0
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        response = client.post("/food_entry/", json=entry_data, headers=auth_headers)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_food_entry_negative_quantity(self, client, auth_headers):
        """Test creating food entry with negative quantity."""
        entry_data = {
            "user": "testuser",
            "food": "Banana",
            "quantity": -5,
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        response = client.post("/food_entry/", json=entry_data, headers=auth_headers)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_food_entry_missing_fields(self, client, auth_headers):
        """Test creating food entry with missing required fields."""
        entry_data = {
            "food": "Banana",
            "quantity": 3
            # Missing is_safe and date
        }
        
        response = client.post("/food_entry/", json=entry_data, headers=auth_headers)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.unit
@pytest.mark.food
class TestUpdateFoodEntry:
    """Test updating food entries."""
    
    def test_update_own_food_entry(self, client, test_user, auth_headers, sample_food_entry):
        """Test user updating their own food entry."""
        update_data = {
            "user": test_user.username,
            "food": "Orange",
            "quantity": 5,
            "is_safe": False,
            "date": datetime.now().isoformat()
        }
        
        response = client.put(
            f"/food_entry/{sample_food_entry.id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Food entry updated"
        assert data["food_entry"]["food"] == "Orange"
        assert data["food_entry"]["quantity"] == 5
    
    def test_update_nonexistent_entry(self, client, auth_headers):
        """Test updating non-existent food entry."""
        update_data = {
            "user": "testuser",
            "food": "Orange",
            "quantity": 5,
            "is_safe": False,
            "date": datetime.now().isoformat()
        }
        
        response = client.put(
            "/food_entry/99999",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_other_users_entry(self, client, db_session, test_user, test_admin, auth_headers):
        """Test user trying to update another user's entry."""
        from models import FoodEntry
        
        # Create entry owned by admin
        admin_entry = FoodEntry(
            user=test_admin.username,
            food="AdminFood",
            quantity=1,
            is_safe=True,
            date=datetime.now(),
            owner_id=test_admin.id
        )
        db_session.add(admin_entry)
        db_session.commit()
        db_session.refresh(admin_entry)
        
        update_data = {
            "user": test_user.username,
            "food": "HackedFood",
            "quantity": 10,
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        # Regular user tries to update admin's entry
        response = client.put(
            f"/food_entry/{admin_entry.id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_admin_can_update_any_entry(self, client, test_admin, admin_headers, sample_food_entry):
        """Test admin can update any user's entry."""
        update_data = {
            "user": test_admin.username,
            "food": "AdminUpdatedFood",
            "quantity": 7,
            "is_safe": True,
            "date": datetime.now().isoformat()
        }
        
        response = client.put(
            f"/food_entry/{sample_food_entry.id}",
            json=update_data,
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.unit
@pytest.mark.food
class TestDeleteFoodEntry:
    """Test deleting food entries."""
    
    def test_delete_own_food_entry(self, client, test_user, auth_headers, sample_food_entry):
        """Test user deleting their own food entry."""
        response = client.delete(
            f"/food_entry/{sample_food_entry.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT or response.status_code == status.HTTP_200_OK
    
    def test_delete_nonexistent_entry(self, client, auth_headers):
        """Test deleting non-existent food entry."""
        response = client.delete(
            "/food_entry/99999",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_other_users_entry(self, client, db_session, test_user, test_admin, auth_headers):
        """Test user trying to delete another user's entry."""
        from models import FoodEntry
        
        # Create entry owned by admin
        admin_entry = FoodEntry(
            user=test_admin.username,
            food="AdminFood",
            quantity=1,
            is_safe=True,
            date=datetime.now(),
            owner_id=test_admin.id
        )
        db_session.add(admin_entry)
        db_session.commit()
        db_session.refresh(admin_entry)
        
        # Regular user tries to delete admin's entry
        response = client.delete(
            f"/food_entry/{admin_entry.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_admin_can_delete_any_entry(self, client, test_admin, admin_headers, sample_food_entry):
        """Test admin can delete any user's entry."""
        response = client.delete(
            f"/food_entry/{sample_food_entry.id}",
            headers=admin_headers
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT or response.status_code == status.HTTP_200_OK
    
    def test_delete_unauthenticated(self, client, sample_food_entry):
        """Test deleting food entry without authentication."""
        response = client.delete(f"/food_entry/{sample_food_entry.id}")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


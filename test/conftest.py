"""
Pytest configuration and fixtures for testing
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import timedelta

from main import app
from models import Base, User, FoodEntry
from routers.auth import get_db, bcrypt_context, create_access_token

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    """Create a test user in the database."""
    user = User(
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        hashed_password=bcrypt_context.hash("testpassword123"),
        role="user",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_admin(db_session):
    """Create a test admin user in the database."""
    admin = User(
        username="adminuser",
        email="admin@example.com",
        full_name="Admin User",
        hashed_password=bcrypt_context.hash("adminpassword123"),
        role="admin",
        is_active=True
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def user_token(test_user):
    """Generate JWT token for test user."""
    token = create_access_token(
        test_user.username,
        test_user.id,
        test_user.role,
        timedelta(minutes=30)
    )
    return token


@pytest.fixture
def admin_token(test_admin):
    """Generate JWT token for test admin."""
    token = create_access_token(
        test_admin.username,
        test_admin.id,
        test_admin.role,
        timedelta(minutes=30)
    )
    return token


@pytest.fixture
def auth_headers(user_token):
    """Create authorization headers for regular user."""
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token):
    """Create authorization headers for admin user."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def sample_food_entry(db_session, test_user):
    """Create a sample food entry in the database."""
    from datetime import datetime
    food_entry = FoodEntry(
        user=test_user.username,
        food="Apple",
        quantity=2,
        is_safe=True,
        date=datetime.now(),
        owner_id=test_user.id
    )
    db_session.add(food_entry)
    db_session.commit()
    db_session.refresh(food_entry)
    return food_entry


@pytest.fixture
def multiple_food_entries(db_session, test_user, test_admin):
    """Create multiple food entries for different users."""
    from datetime import datetime
    entries = []
    
    # User's entries
    for i in range(3):
        entry = FoodEntry(
            user=test_user.username,
            food=f"Food{i}",
            quantity=i+1,
            is_safe=True,
            date=datetime.now(),
            owner_id=test_user.id
        )
        db_session.add(entry)
        entries.append(entry)
    
    # Admin's entries
    for i in range(2):
        entry = FoodEntry(
            user=test_admin.username,
            food=f"AdminFood{i}",
            quantity=i+1,
            is_safe=False,
            date=datetime.now(),
            owner_id=test_admin.id
        )
        db_session.add(entry)
        entries.append(entry)
    
    db_session.commit()
    for entry in entries:
        db_session.refresh(entry)
    
    return entries


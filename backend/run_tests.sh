#!/bin/bash

# Test runner script for RCU App

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}    RCU App Test Runner${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Check if pytest is installed
if ! command -v pytest &> /dev/null; then
    echo -e "${YELLOW}pytest not found. Installing dependencies...${NC}"
    pip3 install -r requirements-test.txt
fi

# Parse command line arguments
case "$1" in
    "all")
        echo -e "${GREEN}Running all tests...${NC}"
        pytest test/ -v
        ;;
    "unit")
        echo -e "${GREEN}Running unit tests only...${NC}"
        pytest test/ -m unit -v
        ;;
    "integration")
        echo -e "${GREEN}Running integration tests only...${NC}"
        pytest test/ -m integration -v
        ;;
    "auth")
        echo -e "${GREEN}Running authentication tests...${NC}"
        pytest test/test_auth.py -v
        ;;
    "food")
        echo -e "${GREEN}Running food entry tests...${NC}"
        pytest test/test_food.py -v
        ;;
    "admin")
        echo -e "${GREEN}Running admin tests...${NC}"
        pytest test/test_admin.py -v
        ;;
    "users")
        echo -e "${GREEN}Running user tests...${NC}"
        pytest test/test_users.py -v
        ;;
    "coverage")
        echo -e "${GREEN}Running tests with coverage...${NC}"
        pytest test/ --cov=. --cov-report=html --cov-report=term
        echo ""
        echo -e "${BLUE}Coverage report generated in htmlcov/index.html${NC}"
        ;;
    "quick")
        echo -e "${GREEN}Running quick test suite...${NC}"
        pytest test/ --tb=short -q
        ;;
    *)
        echo -e "${YELLOW}Usage: ./run_tests.sh [option]${NC}"
        echo ""
        echo "Options:"
        echo "  all         - Run all tests"
        echo "  unit        - Run unit tests only"
        echo "  integration - Run integration tests only"
        echo "  auth        - Run authentication tests"
        echo "  food        - Run food entry tests"
        echo "  admin       - Run admin tests"
        echo "  users       - Run user tests"
        echo "  coverage    - Run tests with coverage report"
        echo "  quick       - Run quick test suite (less verbose)"
        echo ""
        echo "Example: ./run_tests.sh all"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}=================================${NC}"


#!/bin/bash

# API Test Script for AWS re:Invent Sessions API
# This script tests all API endpoints to verify functionality

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "AWS re:Invent Sessions API Test Suite"
echo "=========================================="
echo ""

# Function to print test results
print_test() {
    local test_name=$1
    local status=$2
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $test_name"
    else
        echo -e "${RED}✗${NC} $test_name"
    fi
}

# Test 1: Health Check
echo -e "${BLUE}Testing Health Check...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$response" == "200" ]; then
    print_test "Health Check" 0
    curl -s "$BASE_URL/health" | jq '.'
else
    print_test "Health Check" 1
fi
echo ""

# Test 2: Get All Sessions
echo -e "${BLUE}Testing GET /api/sessions...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/sessions?page=1&limit=5")
if [ "$response" == "200" ]; then
    print_test "Get All Sessions" 0
    echo "Sample response:"
    curl -s "$BASE_URL/api/sessions?page=1&limit=2" | jq '.data.sessions[0] | {session_id, title, track, level}'
else
    print_test "Get All Sessions" 1
fi
echo ""

# Test 3: Get Single Session
echo -e "${BLUE}Testing GET /api/sessions/:id...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/sessions/KEY001")
if [ "$response" == "200" ]; then
    print_test "Get Single Session" 0
    echo "Sample response:"
    curl -s "$BASE_URL/api/sessions/KEY001" | jq '.data | {session_id, title, speakers: .speakers | length}'
else
    print_test "Get Single Session" 1
fi
echo ""

# Test 4: Search Sessions
echo -e "${BLUE}Testing GET /api/sessions/search...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/sessions/search?track=AI%2FML")
if [ "$response" == "200" ]; then
    print_test "Search Sessions" 0
    echo "Sample response (AI/ML track):"
    curl -s "$BASE_URL/api/sessions/search?track=AI%2FML&limit=2" | jq '.data | {total, filters}'
else
    print_test "Search Sessions" 1
fi
echo ""

# Test 5: Search by Keywords
echo -e "${BLUE}Testing Search by Keywords...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/sessions/search?keywords=serverless")
if [ "$response" == "200" ]; then
    print_test "Search by Keywords" 0
    echo "Sample response (serverless):"
    curl -s "$BASE_URL/api/sessions/search?keywords=serverless&limit=1" | jq '.data.sessions[0] | {title, track}'
else
    print_test "Search by Keywords" 1
fi
echo ""

# Test 6: Get All Speakers
echo -e "${BLUE}Testing GET /api/speakers...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/speakers?page=1&limit=5")
if [ "$response" == "200" ]; then
    print_test "Get All Speakers" 0
    echo "Sample response:"
    curl -s "$BASE_URL/api/speakers?page=1&limit=2" | jq '.data.speakers[0] | {speaker_id, name, company, session_count}'
else
    print_test "Get All Speakers" 1
fi
echo ""

# Test 7: Get Single Speaker
echo -e "${BLUE}Testing GET /api/speakers/:id...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/speakers/1")
if [ "$response" == "200" ]; then
    print_test "Get Single Speaker" 0
    echo "Sample response:"
    curl -s "$BASE_URL/api/speakers/1" | jq '.data | {name, company, sessions: .sessions | length}'
else
    print_test "Get Single Speaker" 1
fi
echo ""

# Test 8: Add to Schedule
echo -e "${BLUE}Testing POST /api/schedule...${NC}"
TEST_USER="test-user-$RANDOM@example.com"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/schedule" \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$TEST_USER\",\"sessionId\":\"AIM302\",\"notes\":\"Test note\"}")
if [ "$response" == "201" ]; then
    print_test "Add to Schedule" 0
    echo "Added session to schedule for user: $TEST_USER"
else
    print_test "Add to Schedule" 1
fi
echo ""

# Test 9: Get User Schedule
echo -e "${BLUE}Testing GET /api/schedule/:userId...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/schedule/$TEST_USER")
if [ "$response" == "200" ]; then
    print_test "Get User Schedule" 0
    echo "User schedule:"
    curl -s "$BASE_URL/api/schedule/$TEST_USER" | jq '.data | {userId, scheduleCount}'
    SCHEDULE_ID=$(curl -s "$BASE_URL/api/schedule/$TEST_USER" | jq -r '.data.schedule[0].schedule_id')
else
    print_test "Get User Schedule" 1
fi
echo ""

# Test 10: Remove from Schedule
echo -e "${BLUE}Testing DELETE /api/schedule/:scheduleId...${NC}"
if [ ! -z "$SCHEDULE_ID" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/schedule/$SCHEDULE_ID" \
        -H "Content-Type: application/json" \
        -d "{\"userId\":\"$TEST_USER\"}")
    if [ "$response" == "200" ]; then
        print_test "Remove from Schedule" 0
        echo "Removed session from schedule"
    else
        print_test "Remove from Schedule" 1
    fi
else
    echo -e "${RED}Skipping - no schedule ID available${NC}"
fi
echo ""

# Test 11: Get Metadata
echo -e "${BLUE}Testing GET /api/metadata...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/metadata")
if [ "$response" == "200" ]; then
    print_test "Get Metadata" 0
    echo "Available metadata:"
    curl -s "$BASE_URL/api/metadata" | jq '.data | {sessionTypes: .sessionTypes | length, tracks: .tracks | length, levels: .levels | length}'
else
    print_test "Get Metadata" 1
fi
echo ""

# Test 12: Test 404 Handler
echo -e "${BLUE}Testing 404 Handler...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/nonexistent")
if [ "$response" == "404" ]; then
    print_test "404 Handler" 0
else
    print_test "404 Handler" 1
fi
echo ""

# Test 13: Test Invalid Pagination
echo -e "${BLUE}Testing Input Validation (Invalid Pagination)...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/sessions?page=0&limit=200")
if [ "$response" == "400" ]; then
    print_test "Input Validation" 0
else
    print_test "Input Validation" 1
fi
echo ""

echo "=========================================="
echo "Test Suite Complete"
echo "=========================================="

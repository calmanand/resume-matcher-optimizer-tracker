#!/usr/bin/env python3
"""
Test script to verify authentication endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_signup():
    """Test user signup"""
    try:
        test_user = {
            "fullName": "Test User",
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=test_user)
        print(f"📝 Signup test: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Signup successful")
            return response.cookies.get("jwt")
        elif response.status_code == 400:
            print("   ⚠️ User might already exist (this is normal)")
            return None
        else:
            print(f"   ❌ Signup failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Signup test failed: {e}")
        return None

def test_login():
    """Test user login"""
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"🔐 Login test: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Login successful")
            return response.cookies.get("jwt")
        else:
            print(f"   ❌ Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return None

def test_check_auth(token):
    """Test authentication check"""
    try:
        cookies = {"jwt": token} if token else {}
        response = requests.get(f"{BASE_URL}/auth/check-auth", cookies=cookies)
        print(f"🔍 Auth check: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Authentication successful")
            return True
        elif response.status_code == 401:
            print("   ⚠️ Not authenticated (this is normal if no token)")
            return False
        else:
            print(f"   ❌ Auth check failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Auth check test failed: {e}")
        return False

def test_hr_endpoint():
    """Test HR endpoint"""
    try:
        test_jd = "We are seeking a Python developer with experience in FastAPI and MongoDB."
        
        response = requests.post(
            f"{BASE_URL}/hr/top-matches",
            data={"jd_text": test_jd},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        print(f"👥 HR endpoint test: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ HR endpoint working - Found {data.get('count', 0)} resumes")
            return True
        else:
            print(f"   ❌ HR endpoint failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ HR endpoint test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Authentication System")
    print("=" * 40)
    
    # Test health endpoint
    if not test_health_endpoint():
        print("❌ Backend is not running. Please start the server first.")
        exit(1)
    
    print("\n" + "=" * 40)
    
    # Test signup
    token = test_signup()
    
    # Test login if signup didn't work
    if not token:
        token = test_login()
    
    # Test auth check
    if token:
        test_check_auth(token)
    else:
        test_check_auth(None)
    
    print("\n" + "=" * 40)
    
    # Test HR endpoint
    test_hr_endpoint()
    
    print("\n✅ Authentication system test complete!") 
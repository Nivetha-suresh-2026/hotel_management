import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.config.supabase_client import supabase
import time

# Constants
security = HTTPBearer()

# SIMPLE MEMORY CACHE
# Key: token string, Value: (expiry_timestamp, payload_dict)
_token_cache = {}
CACHE_TTL = 300  # 5 minutes in seconds

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifies the JWT. Includes a local cache to prevent redundant 
    network calls to Supabase, which significantly speeds up the portal.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    # 1. Check Cache first
    current_time = time.time()
    if token in _token_cache:
        expiry, payload = _token_cache[token]
        if current_time < expiry:
            return payload
        else:
            del _token_cache[token] # Cache expired

    try:
        # 2. Ask Supabase to verify (Network call - slow)
        response = supabase.auth.get_user(token)
        
        if not response or not hasattr(response, 'user') or not response.user:
            raise HTTPException(status_code=401, detail="Invalid session")
            
        user = response.user
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "user_metadata": user.user_metadata or {},
            "role": user.role or "authenticated"
        }

        # 3. Save to Cache
        _token_cache[token] = (current_time + CACHE_TTL, payload)
        
        return payload

    except Exception as e:
        error_msg = str(e)
        if "401" in error_msg or "invalid" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        raise HTTPException(status_code=401, detail=f"Auth error: {error_msg}")

def get_current_user_id(payload: dict = Security(verify_jwt)):
    """Extracts the auth_id (sub) from the verified payload."""
    return payload.get("sub")

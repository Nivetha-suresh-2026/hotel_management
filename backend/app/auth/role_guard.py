from fastapi import HTTPException, Depends
from app.auth.jwt_handler import verify_jwt
from app.config.supabase_client import supabase

async def get_user_role(payload: dict = Depends(verify_jwt)):
    """Fetches the user role from public.users using auth_id (sub)."""
    auth_id = payload.get("sub")
    
    response = supabase.table("users").select("role").eq("auth_id", auth_id).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=403, detail="User profile not found")
        
    return response.data.get("role")

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, role: str = Depends(get_user_role)):
        if role not in self.allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. Role '{role}' not authorized. Required: {self.allowed_roles}"
            )
        return True

# Predefined role guards
admin_only = RoleChecker(["admin", "hotel_owner"])
staff_only = RoleChecker(["staff"])
owner_only = RoleChecker(["hotel_owner"])
any_authenticated = RoleChecker(["admin", "hotel_owner", "staff"])

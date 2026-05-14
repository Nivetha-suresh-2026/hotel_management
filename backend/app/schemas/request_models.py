from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import date

class StaffCreateRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    branch_id: str
    role_id: str
    phone: Optional[str] = None
    shift: Optional[str] = "Morning"
    employment_type: Optional[str] = "Full Time"
    status: Optional[str] = "active"
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    identity_type: Optional[str] = None
    identity_number: Optional[str] = None
    portal_permissions: Optional[Dict[str, Any]] = {}
    joined_date: Optional[str] = None

class TaskStatusUpdate(BaseModel):
    status: str

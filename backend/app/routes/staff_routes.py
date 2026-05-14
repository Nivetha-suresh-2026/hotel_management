from fastapi import APIRouter, Depends, Body
from app.auth.jwt_handler import get_current_user_id
from app.auth.role_guard import admin_only, staff_only
from app.services.staff_service import staff_service
from app.schemas.request_models import StaffCreateRequest, TaskStatusUpdate

router = APIRouter(prefix="/api/v1/staff", tags=["Staff Portal"])

# Admin Only: Create Staff
@router.post("/admin/create", dependencies=[Depends(admin_only)])
async def create_staff(payload: StaffCreateRequest, creator_id: str = Depends(get_current_user_id)):
    # Get internal ID of the creator for the 'created_by' field
    from app.config.supabase_client import supabase
    creator = supabase.table("users").select("id").eq("auth_id", creator_id).single().execute()
    payload_dict = payload.model_dump()
    payload_dict["created_by_internal_id"] = creator.data["id"] if creator.data else None
    
    return await staff_service.create_staff_account(payload_dict)

# Staff Only: My Profile
@router.get("/portal/me", dependencies=[Depends(staff_only)])
async def get_my_profile(auth_id: str = Depends(get_current_user_id)):
    return await staff_service.get_staff_profile(auth_id)

# Staff Only: My Tasks
@router.get("/portal/tasks", dependencies=[Depends(staff_only)])
async def get_my_tasks(auth_id: str = Depends(get_current_user_id)):
    return await staff_service.get_staff_tasks(auth_id)

# Staff Only: Update Task Status
@router.patch("/portal/tasks/{task_id}", dependencies=[Depends(staff_only)])
async def update_task(task_id: str, update: TaskStatusUpdate, auth_id: str = Depends(get_current_user_id)):
    return await staff_service.update_task_status(task_id, update.status, auth_id)

# Staff Only: Dashboard Summary
@router.get("/portal/dashboard", dependencies=[Depends(staff_only)])
async def get_dashboard(auth_id: str = Depends(get_current_user_id)):
    return await staff_service.get_dashboard_data(auth_id)

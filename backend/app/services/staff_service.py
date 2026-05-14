from app.config.supabase_client import supabase
from fastapi import HTTPException
from datetime import datetime

class StaffService:
    @staticmethod
    async def get_staff_profile(auth_id: str):
        """Fetches staff profile directly using the new auth_id column."""
        res = supabase.table("staff").select(
            "*, hotel_branches(branch_name), job_roles(role_name, departments(name))"
        ).eq("auth_id", auth_id).single().execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Staff profile not found")
        return res.data

    @staticmethod
    async def get_staff_tasks(auth_id: str):
        """Fetches tasks for the staff member linked to this auth_id."""
        # Get the internal staff.id first using our new auth_id column
        staff = supabase.table("staff").select("id").eq("auth_id", auth_id).single().execute()
        if not staff.data:
            raise HTTPException(status_code=404, detail="Staff record not found")
            
        res = supabase.table("assigned_tasks").select("*").eq("staff_id", staff.data["id"]).order("created_at", desc=True).execute()
        return res.data or []

    @staticmethod
    async def update_task_status(task_id: str, status: str, auth_id: str):
        """Updates task status after verifying ownership."""
        staff = supabase.table("staff").select("id").eq("auth_id", auth_id).single().execute()
        
        check = supabase.table("assigned_tasks").select("staff_id").eq("id", task_id).single().execute()
        if not check.data or check.data["staff_id"] != staff.data["id"]:
            raise HTTPException(status_code=403, detail="Not authorized to update this task")

        update_data = {"status": status}
        if status == "completed":
            update_data["completed_at"] = datetime.utcnow().isoformat()
            
        res = supabase.table("assigned_tasks").update(update_data).eq("id", task_id).execute()
        return res.data

    @staticmethod
    async def get_dashboard_data(auth_id: str):
        """Returns summary data for the staff dashboard."""
        profile = await StaffService.get_staff_profile(auth_id)
        tasks = await StaffService.get_staff_tasks(auth_id)
        
        counts = {
            "total": len(tasks),
            "pending": len([t for t in tasks if t["status"] == "pending"]),
            "in_progress": len([t for t in tasks if t["status"] == "in_progress"]),
            "completed": len([t for t in tasks if t["status"] == "completed"])
        }
        
        return {
            "staff_name": profile["full_name"],
            "branch": profile.get("hotel_branches", {}).get("branch_name"),
            "shift": profile["shift"],
            "task_counts": counts
        }

staff_service = StaffService()

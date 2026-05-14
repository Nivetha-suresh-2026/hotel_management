from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.staff_routes import router as staff_router
from fastapi.responses import JSONResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hostay Staff Portal Backend")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Staff Router
app.include_router(staff_router)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global Error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "message": str(exc)},
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "staff-portal-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

from starlette.middleware.base import BaseHTTPMiddleware
import os


class RemoveReportAfterResponse(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        try:
            filename = request.path_params.get("")
            if filename:
                report_path = os.path.join(os.path.dirname(__file__), "reports", filename)
                if os.path.exists(report_path):
                    os.remove(report_path)
                    print(report_path)
        except Exception as e:
            print(f"Error deleting file: {str(e)}")
        return response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from .services import get_jobs, export_jobs_to_excel, create_job, delete_job, update_job

class JobListView(APIView):
    def get(self, request, *args, **kwargs):
        page_size = request.GET.get('page_size', 10)
        response = get_jobs(request, page_size)
        return response
    
class JobCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request, *args, **kwargs):
        response = create_job(request.data)
        return response
    
class JobUpdateView(APIView):
    parser_classes = [FormParser, MultiPartParser]
    
    def put(self, request, job_id, *args, **kwargs):
        response = update_job(job_id, request.data)
        return response
    
class JobDeleteView(APIView):
    parser_classes = [JSONParser]
    
    def put(self, request, job_id, *args, **kwargs):
        response = delete_job(job_id)
        return response
    
class JobsExportView(APIView):
    def get(self, request, *args, **kwargs):
        response = export_jobs_to_excel()
        return response
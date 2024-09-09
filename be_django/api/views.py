from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .services import get_jobs, export_jobs_to_excel, create_job, delete_job, update_job, scrape_jobs

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
    
class JobScrapeView(APIView):
    def post(self, request, *args, **kwargs):
        keyword = request.GET.get('keyword', None)
        location = request.GET.get('location', None)
        
        if not keyword:
            return Response({"error": "Keyword is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not location:
            return Response({"error": "Location is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        jobs = scrape_jobs(keyword, location)
        
        if not jobs:
            return Response({"message": "No jobs found or there was an issue with scraping."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "message": f"Successfully scraped {len(jobs)} jobs for keyword: {keyword}",
            "data": jobs
        }, status=status.HTTP_200_OK)
    
class JobsExportView(APIView):
    def get(self, request, *args, **kwargs):
        response = export_jobs_to_excel()
        return response
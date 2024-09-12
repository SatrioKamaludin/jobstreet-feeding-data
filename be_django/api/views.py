from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .services import get_jobs, export_jobs_to_excel, create_job, delete_job, update_job, scrape_jobs

class JobListView(APIView):
    """
    Get the list of jobs with pagination.
    Optional query parameter:
    - `page_size`: The number of jobs per page (default is 10).
    """
    
    @swagger_auto_schema(
        operation_description="Retrieve a paginated list of jobs.",
        manual_parameters=[
            openapi.Parameter('page', openapi.IN_QUERY, description="Page", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('sort', openapi.IN_QUERY, description="Sort order", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('search', openapi.IN_QUERY, description="Search query", type=openapi.TYPE_STRING, required=False),
        ],
        responses={200: 'A list of jobs.', 400: 'Bad Request'}
    )
    def get(self, request, *args, **kwargs):
        page_size = request.GET.get('page_size', 10)
        response = get_jobs(request, page_size)
        return response
    
class JobCreateView(APIView):
    """
    Create a new job.
    """
    parser_classes = [MultiPartParser, FormParser]
    @swagger_auto_schema(
        operation_description="Create a new job with the provided details.",
        manual_parameters=[
            openapi.Parameter('title', openapi.IN_FORM, description="Job title", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('company_name', openapi.IN_FORM, description="Company name", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('location', openapi.IN_FORM, description="Job location", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('salary', openapi.IN_FORM, description="Job salary", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('work_type', openapi.IN_FORM, description="Job work type", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('keyword', openapi.IN_FORM, description="Job keyword", type=openapi.TYPE_STRING, required=True)
        ],
        responses={201: 'Job created successfully.', 400: 'Bad Request'}
    )
    def post(self, request, *args, **kwargs):
        response = create_job(request.data)
        return response
    
class JobUpdateView(APIView):
    """
    Update job details.
    """
    parser_classes = [FormParser, MultiPartParser]
    @swagger_auto_schema(
        operation_description="Update the details of an existing job.",
                manual_parameters=[
            openapi.Parameter('title', openapi.IN_FORM, description="Job title", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('company_name', openapi.IN_FORM, description="Company name", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('location', openapi.IN_FORM, description="Job location", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('salary', openapi.IN_FORM, description="Job salary", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('work_type', openapi.IN_FORM, description="Job work type (e.g., full-time, part-time)", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('keyword', openapi.IN_FORM, description="Job keyword for search", type=openapi.TYPE_STRING, required=False),
        ],
        consumes=['application/x-www-form-urlencoded'],
        responses={200: 'Job updated successfully.', 404: 'Job not found.'}
    )
    def put(self, request, job_id, *args, **kwargs):
        response = update_job(job_id, request.data)
        return response
    
class JobDeleteView(APIView):
    """
    Mark a job as deleted.
    """
    
    parser_classes = [JSONParser]
    @swagger_auto_schema(
        operation_description="Delete a job by marking it as deleted.",
        responses={200: 'Job deleted successfully.', 404: 'Job not found.'}
    )
    def put(self, request, job_id, *args, **kwargs):
        response = delete_job(job_id)
        return response
        
class JobScrapeView(APIView):
    """
    Scrape job data from Jobstreet.
    Required query parameters:
    - `keyword`: The job keyword to search for.
    - `location`: The location to search for jobs in.
    """
    
    @swagger_auto_schema(
        operation_description="Scrape jobs from Jobstreet based on keyword and location.",
        manual_parameters=[
            openapi.Parameter('keyword', openapi.IN_QUERY, description="Job keyword", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('location', openapi.IN_QUERY, description="Job location", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('page', openapi.IN_QUERY, description="Page number to scrape", type=openapi.TYPE_INTEGER, required=True)
        ],
        responses={200: 'Jobs scraped successfully.', 400: 'Bad Request', 404: 'No jobs found.'}
    )
    def post(self, request, *args, **kwargs):
        keyword = request.GET.get('keyword', None)
        location = request.GET.get('location', None)
        page = request.GET.get('page', 1)  # Default page is 1
            
        if not keyword:
            return Response({"error": "Keyword is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not location:
            return Response({"error": "Location is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "Page number must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        jobs = scrape_jobs(keyword, location, page)
        
        if not jobs:
            return Response({"message": "No jobs found or there was an issue with scraping."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "message": f"Successfully scraped {len(jobs)} jobs for keyword: {keyword} with location: {location} and page: {page}.",
            "data": jobs
        }, status=status.HTTP_200_OK)
    
class JobsExportView(APIView):
    """
    Export job data to an Excel file.
    """
    
    @swagger_auto_schema(
        operation_description="Export job data to an Excel file.",
        responses={200: 'Jobs exported successfully.', 500: 'Internal Server Error'}
    )
    def get(self, request, *args, **kwargs):
        response = export_jobs_to_excel()
        return response
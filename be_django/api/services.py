import json
import re
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
import math
import xlwt
import random
import requests
from bs4 import BeautifulSoup
from io import BytesIO
from datetime import datetime
from django.http import HttpResponse
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from faker import Faker
from .models import Jobs
from .serializers import JobsSerializer, JobsUpdateSerializer

def get_jobs(request, page_size):
    try:
        page_size = int(page_size)  # Convert page_size to integer
    except ValueError:
        page_size = 10  # Default value if conversion fails
        
    sort_param = request.GET.get('sort', 'listingDateDesc')  # Default sort parameter
    sorting_options = {
        'listingDateDesc': '-listing_date',
        'listingDateAsc': 'listing_date',
        'titleAsc': 'title',
        'titleDesc': '-title',
    }
    search_query = request.GET.get('search', '')
    
    sort_field = sorting_options.get(sort_param, '-listing_date')
    
    if len(search_query) > 0 and len(search_query) < 3:
        return Response({
            'error':'Please enter at least 3 characters to search.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    jobs_queryset = Jobs.objects.filter(
        is_deleted=False
        ).filter(
            Q(title__icontains=search_query) |
            Q(company_name__icontains=search_query) |
            Q(keyword__icontains=search_query)
        ).order_by(sort_field)
        
    paginator = PageNumberPagination()
    paginator.page_size = page_size
    
    total_count = jobs_queryset.count()
    total_pages = math.ceil(total_count/page_size)
    
    paginated_jobs = paginator.paginate_queryset(jobs_queryset, request)
    serializer = JobsSerializer(paginated_jobs, many=True)
    
    response_data = {
        'count': total_count,
        'totalPages': total_pages,
        'next': paginator.get_next_link(),
        'previous': paginator.get_previous_link(),
        'results': serializer.data
    }
    
    return Response(response_data)

def create_job(data):
    serializer = JobsSerializer(data=data)
    
    if(serializer.is_valid()):
        job = serializer.save()
        job_serializer = JobsSerializer(job)
        return Response({
           'job': job_serializer.data,
            'message': 'Job created successfully.'
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def update_job(job_id, data):
    try:
        job = Jobs.objects.get(id=job_id)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    valid_data = {key: value for key, value in data.items() if value is not None and value != ''}
    serializer = JobsSerializer(job, data=valid_data, partial=True, context={'is_creation': False})
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'job': serializer.data,
            'message': 'Job updated successfully.'
        }, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def delete_job(job_id):
    try:
        job = Jobs.objects.get(id=job_id)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    job.is_deleted = True
    job.save()
    
    serializer = JobsUpdateSerializer(job)
    
    return Response({
        'message': f'Job {job_id} deleted successfully.'
    }, status=status.HTTP_200_OK)

def fetch_page_data(page, keyword, location):
    url = f"https://id.jobstreet.com/id/{keyword}-jobs/in-{location}?page={page}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        script = soup.find('script', text=re.compile('window.SEEK_REDUX_DATA'))
        if script:
            json_text = re.search(r'window\.SEEK_REDUX_DATA\s*=\s*(\{.*\});', script.string).group(1)
            return json.loads(json_text)
    except (requests.RequestException, AttributeError, json.JSONDecodeError):
        return None
    
def scrape_jobs(keyword, location):
    data_per_page = 32  # assuming each page contains 32 job listings
    total_jobs = []
    
    # Fetch data for the first page to calculate max_pages
    data = fetch_page_data(1, keyword, location)
    if data:
        total_data = int(data['results']['results']['summary']['displayTotalCount'].replace(",", ""))
        max_pages = math.ceil(total_data / data_per_page)
    else:
        return []
    
    for page in range(1, max_pages + 1):
        data = fetch_page_data(page, keyword, location)
        if data:
            jobs = data['results']['results']['jobs']
            for job in jobs:
                title = job.get('title', 'No Title')
                company_name = job.get('advertiser', {}).get('description', 'No Company Name')
                location = job.get('location', 'No Location')
                listing_date = job.get('listingDate', 'No Listing Date')
                salary = job.get('salary', 'No Salary')
                work_type = job.get('workType', 'No Work Type')
                
                if listing_date != 'No Listing Date':
                    try:
                        listing_date_obj = datetime.strptime(listing_date, "%Y-%m-%dT%H:%M:%SZ")
                        formatted_date = listing_date_obj.strftime("%Y-%m-%d")
                    except ValueError:
                        formatted_date = 'Invalid Date Format'
                else:
                    formatted_date = 'No Listing Date'
                    
                Jobs.objects.update_or_create(
                    title=title,
                    company_name=company_name,
                    keyword=keyword,  
                    defaults={
                        'work_type': work_type,
                        'location': location,
                        'salary': salary,
                        'listing_date': formatted_date
                    }
                )
                total_jobs.append({
                    'title': title,
                    'company_name': company_name,
                    'location': location,
                    'listing_date': formatted_date,
                    'salary': salary,
                    'work_type': work_type,
                })
    return total_jobs

def export_jobs_to_excel():
    # Create a workbook and add a worksheet
    workbook = xlwt.Workbook()
    worksheet = workbook.add_sheet('Jobs')
    
    # Define the header row
    headers = ['ID', 'Title', 'Company Name', 'Work Type', 'Location', 'Salary', 'Listing Date', 'Keyword']
    for col_num, header in enumerate(headers):
        worksheet.write(0, col_num, header)
        
    # Query the jobs
    jobs_queryset = Jobs.objects.filter(is_deleted=False).order_by('-listing_date')
    jobs_data = JobsSerializer(jobs_queryset, many=True).data
    
    # Write the data rows
    for row_num, job in enumerate(jobs_data, start=1):
        worksheet.write(row_num, 0, str(job['id']))
        worksheet.write(row_num, 1, job['title'])
        worksheet.write(row_num, 2, job['company_name'])
        worksheet.write(row_num, 3, job['work_type'])
        worksheet.write(row_num, 4, job['location'])
        worksheet.write(row_num, 5, job['salary'])
        worksheet.write(row_num, 6, job['listing_date'])
        worksheet.write(row_num, 7, job['keyword'])

    # Save the workbook to a BytesIO stream
    response = HttpResponse(content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=jobs_export.xls'
    workbook.save(response)
    return response

    
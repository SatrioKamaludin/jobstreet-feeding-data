from django.core.paginator import Paginator
from django.http import HttpResponse
from django.utils import timezone
from django.utils.timesince import timesince
import xlwt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from .models import Jobs
from .serializers import JobSerializer

class JobService:
    @staticmethod
    def get_jobs(page, items_per_page):
        jobs = Jobs.objects.filter(is_deleted=False)
        paginator = Paginator(jobs, items_per_page)
        paginated_jobs = paginator.get_page(page)

        jobs_data = [
            {
                "id": job.id,
                "title": job.title,
                "company_name": job.company_name,
                "work_type": job.work_type,
                "location": job.location,
                "salary": job.salary,
                "listing_date": job.listing_date.strftime('%Y-%m-%d %H:%M:%S'),
                "keyword": job.keyword,
                "added": f"{timesince(job.listing_date)} ago"
            }
            for job in paginated_jobs
        ]

        return {
            "total": paginator.count,
            "num_pages": paginator.num_pages,
            "current_page": paginated_jobs.number,
            "jobs": jobs_data
        }
        
    @staticmethod
    def add_job(data):
        required_fields = ['title','company_name','work_type','location','salary','keyword']
        missing_fields = [field for field in required_fields if not data.get(field)]
       
        #form validation 
        if missing_fields:
            return None, f"Missing required field(s): {', '.join(missing_fields)}"
            
        #add job
        job = Jobs.objects.create(
            title=data['title'],
            company_name=data['company_name'],
            work_type=data['work_type'],
            location=data['location'],
            salary=data['salary'],
            keyword=data['keyword'],
            listing_date=timezone.now()
        )
        
        return job, None
    
    @staticmethod
    def update_job(job_id, data):
        try:
            job = Jobs.objects.get(id=job_id)
        except Jobs.DoesNotExist:
            return None, f"Job with ID {job_id} not found"
        
        for field, value in data.items():
            if value is not None:
                setattr(job, field, value)
                
        job.save()
        return job, None
    
    @staticmethod
    def export_to_excel():
        jobs = Jobs.objects.all()
        
        # buat workbook dan buat sheet
        workbook = xlwt.Workbook()
        sheet = workbook.add_sheet('Jobs')
        
        # definisi header kolom
        headers = ['ID', 'Title', 'Company Name', 'Work Type', 'Location', 'Salary', 'Listing Date', 'Keyword']
        for col_num, header in enumerate(headers):
            sheet.write(0, col_num, header)
            
        # isi sheet dengan data
        for row_num, job in enumerate(jobs, start=1):
            sheet.write(row_num, 0, job.id)
            sheet.write(row_num, 1, job.title)
            sheet.write(row_num, 2, job.company_name)
            sheet.write(row_num, 3, job.work_type)
            sheet.write(row_num, 4, job.location)
            sheet.write(row_num, 5, job.salary)
            sheet.write(row_num, 6, job.listing_date.strftime("%Y-%m-%d"))
            sheet.write(row_num, 7, job.keyword)
            
        # header response untuk download file excel
        response = HttpResponse(content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="jobs.xls"'
        
        workbook.save(response)
        return response
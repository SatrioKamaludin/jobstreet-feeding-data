import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Jobs
import xlrd

@pytest.fixture
def api_client():
    client = APIClient()
    user = User.objects.create_superuser(username='testuser', password='testpassword', email='test@example.com')
    client.login(username='testuser', password='testpassword')
    return client

@pytest.fixture
def create_jobs():
    jobs = [
        Jobs.objects.create(
            title='Software Engineer',
            company_name='Tech Corp',
            work_type='Full-time',
            location='New York',
            salary='$120,000',
            listing_date='2024-09-10T12:00:00Z',
            keyword='developer'
        ),
        Jobs.objects.create(
            title='Data Scientist',
            company_name='Data Inc',
            work_type='Part-time',
            location='San Francisco',
            salary='$140,000',
            listing_date='2024-09-09T12:00:00Z',
            keyword='data'
        ),
    ]
    return jobs

@pytest.mark.django_db
def test_export_jobs_to_excel(api_client, create_jobs):
    url = reverse('jobs-export')
    response = api_client.get(url)
    
    assert response.status_code == status.HTTP_200_OK
    assert response['Content-Type'] == 'application/vnd.ms-excel'
    assert 'attachment; filename=jobs_export.xls' in response['Content-Disposition']
    
    # Read the Excel file from the response
    workbook = xlrd.open_workbook(file_contents=response.content)
    worksheet = workbook.sheet_by_name('Jobs')
    
    # Check the header row
    headers = ['ID', 'Title', 'Company Name', 'Work Type', 'Location', 'Salary', 'Listing Date', 'Keyword']
    for col_num, header in enumerate(headers):
        assert worksheet.cell_value(0, col_num) == header
    
    # Check the data rows
    job_ids = [str(job.id) for job in create_jobs]
    for row_num in range(1, worksheet.nrows):
        job_id = worksheet.cell_value(row_num, 0)
        assert job_id in job_ids
        job = next(job for job in create_jobs if str(job.id) == job_id)
        assert worksheet.cell_value(row_num, 1) == job.title
        assert worksheet.cell_value(row_num, 2) == job.company_name
        assert worksheet.cell_value(row_num, 3) == job.work_type
        assert worksheet.cell_value(row_num, 4) == job.location
        assert worksheet.cell_value(row_num, 5) == job.salary
        # Compare dates without microseconds
        excel_date = worksheet.cell_value(row_num, 6).split('.')[0]
        job_date = job.listing_date.strftime('%Y-%m-%dT%H:%M:%S').split('.')[0]
        assert excel_date == job_date
        assert worksheet.cell_value(row_num, 7) == job.keyword
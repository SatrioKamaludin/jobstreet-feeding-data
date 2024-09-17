import pytest
from rest_framework import status
from api.models import Jobs
from api.services import create_job

@pytest.mark.django_db
def test_create_job_success():
    job_data = {
        'title': 'Software Engineer',
        'company_name': 'Tech Corp',
        'work_type': 'Full-time',
        'location': 'New York',
        'salary': '$120,000',
        'keyword': 'developer'
    }
    response = create_job(job_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['message'] == 'Job created successfully.'
    assert Jobs.objects.filter(title='Software Engineer').exists()

@pytest.mark.django_db
def test_create_job_invalid_data():
    job_data = {
        'title': '',  # Invalid data
        'company_name': 'Tech Corp',
        'work_type': 'Full-time',
        'location': 'New York',
        'salary': '$120,000',
        'keyword': 'developer'
    }
    response = create_job(job_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'title' in response.data

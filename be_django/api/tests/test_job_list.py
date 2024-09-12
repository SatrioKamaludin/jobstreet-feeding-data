import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.utils.dateparse import parse_datetime
from api.models import Jobs
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def api_client():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    client.force_authenticate(user=user)
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
def test_get_jobs(api_client, create_jobs):
    logger.info("Starting test: test_get_jobs")
    url = reverse('job-list')
    response = api_client.get(url, {'page_size': 10})
    
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response data: {response.data}")
    
    assert response.status_code == status.HTTP_200_OK
    assert 'results' in response.data
    assert len(response.data['results']) == len(create_jobs)
    
    logger.info(f"Number of jobs in response: {len(response.data['results'])}")
    
    assert 'count' in response.data
    assert 'totalPages' in response.data
    assert 'next' in response.data
    assert 'previous' in response.data
    
    first_job = create_jobs[0]
    response_job = response.data['results'][0]
    
    logger.info(f"First job in mock data: {first_job.title}")
    logger.info(f"First job in response: {response_job['title']}")
    
    assert response_job['title'] == first_job.title
    assert response_job['company_name'] == first_job.company_name
    assert response_job['work_type'] == first_job.work_type
    assert response_job['location'] == first_job.location
    assert response_job['salary'] == first_job.salary
    
@pytest.mark.django_db
def test_get_jobs_with_sort(api_client, create_jobs):
    logger.info("Starting test: test_get_jobs_with_sort")
    
    url = reverse('job-list') + '?sort=titleAsc'
    response = api_client.get(url, {'page_size': 10})
    
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response data: {response.data}")
    
    assert response.status_code == status.HTTP_200_OK
    
    sorted_jobs = sorted(create_jobs, key=lambda job: job.title)
    response_jobs = response.data['results']
    
    logger.info(f"First job in sorted mock data: {sorted_jobs[0].title}")
    logger.info(f"First job in response: {response_jobs[0]['title']}")
    
    print("sorted_jobs:", [job.title for job in sorted_jobs])
    print("response_jobs:", [job['title'] for job in response_jobs])
    
    assert response_jobs[0]['title'] == sorted_jobs[0].title
    assert response_jobs[-1]['title'] == sorted_jobs[-1].title

@pytest.mark.django_db
def test_get_jobs_with_search(api_client, create_jobs):
    logger.info("Starting test: test_get_jobs_with_search")
    url = reverse('job-list') + '?search=Software'
    response = api_client.get(url, {'page_size': 10})
    
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response data: {response.data}")
    
    assert response.status_code == status.HTTP_200_OK
    # Validate search test
    response_jobs = response.data['results']
    assert all('data' in job['title'] or 'data' in job['company_name'] or 'data' in job['keyword'] for job in response_jobs)
    
@pytest.mark.django_db
def test_get_jobs_with_invalid_search(api_client):
    logger.info("Starting test: test_get_jobs_with_invalid_search")
    url = reverse('job-list') + '?search=ab'
    response = api_client.get(url, {'page_size': 10})
    
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response data: {response.data}")
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == 'Please enter at least 3 characters to search.'
    
    logger.info(f"Invalid search error message: {response.data['error']}")
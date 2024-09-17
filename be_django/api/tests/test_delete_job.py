import pytest
from rest_framework import status
from api.models import Jobs
from api.services import delete_job
import uuid

@pytest.fixture
def create_jobs():
    job1 = Jobs.objects.create(
        title='Software Engineer',
        company_name='Tech Corp',
        work_type='Full-time',
        location='New York',
        salary='$120,000',
        listing_date='2024-09-10T12:00:00Z',
        keyword='developer'
    )
    job2 = Jobs.objects.create(
        title='Data Scientist',
        company_name='Data Inc',
        work_type='Part-time',
        location='San Francisco',
        salary='$140,000',
        listing_date='2024-09-09T12:00:00Z',
        keyword='data'
    )
    return job1, job2

@pytest.mark.django_db
def test_delete_job_success(create_jobs):
    job1, _ = create_jobs
    response = delete_job(job1.id)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['message'] == f'Job {job1.id} deleted successfully.'
    job1.refresh_from_db()
    assert job1.is_deleted is True

@pytest.mark.django_db
def test_delete_job_not_found():
    non_existent_uuid = uuid.uuid4()  # Generate a valid UUID that doesn't exist in the database
    response = delete_job(non_existent_uuid)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data['error'] == 'Job not found.'

@pytest.mark.django_db
def test_delete_job_already_deleted(create_jobs):
    job1, _ = create_jobs
    job1.is_deleted = True
    job1.save()
    response = delete_job(job1.id)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == 'Job is already deleted.'

from django.urls import path
from .views import job_list_view, export_to_excel, add_job_view, update_job_view

urlpatterns = [
    path('jobs', job_list_view, name='job-list'),
    path('jobs/add', add_job_view, name='add-job'),
    path('jobs/update/<int:job_id>', update_job_view, name='update-job'),
    path('jobs/export', export_to_excel, name='export-to-excel'),
]
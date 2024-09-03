from django.urls import path
from .views import JobListView, JobsExportView, JobCreateView, JobDeleteView, JobUpdateView

urlpatterns = [
    path('jobs', JobListView.as_view(), name='job-list'),
    path('jobs/export', JobsExportView.as_view(), name='jobs-export'),
    path('jobs/add', JobCreateView.as_view(), name='add-job'),
    path('jobs/<uuid:job_id>/delete', JobDeleteView.as_view(), name='delete-job'),
    path('jobs/<uuid:job_id>/update', JobUpdateView.as_view(), name='update-job'),
]
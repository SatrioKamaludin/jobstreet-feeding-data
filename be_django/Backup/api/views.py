from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .services import JobService
from django.http import QueryDict

def job_list_view(request):
    page = request.GET.get('page', 1)
    items_per_page = request.GET.get('items_per_page', 10)

    try:
        page = int(page)
        items_per_page = int(items_per_page)
    except ValueError:
        return JsonResponse({'error': 'Invalid page or items per page value'}, status=400)
    
    jobs_data = JobService.get_jobs(page, items_per_page)
    return JsonResponse(jobs_data)


@csrf_exempt #(@csrf_exempt added for development only, remove it in production)
def add_job_view(request):
    if request.method == 'POST':
        data = {
            'title': request.POST.get('title'),
            'company_name': request.POST.get('company_name'),
            'work_type': request.POST.get('work_type'),
            'location': request.POST.get('location'),
            'salary': request.POST.get('salary'),
            'keyword': request.POST.get('keyword')
        }
        
        job, error = JobService.add_job(data)
        
        if error:
            return JsonResponse({'error': error}, status=400)
        
        return JsonResponse({
            'id': job.id,
            'title': job.title,
            'company_name': job.company_name,
            'work_type': job.work_type,
            'location': job.location,
            'salary': job.salary,
            'listing_date': job.listing_date.strftime("%Y-%m-%d"),
            'keyword': job.keyword
        }, status=201)
        
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def update_job_view(request, job_id):
    if request.method == 'PUT':
        data = QueryDict(request.body).dict()
        data = {k: v for k, v in data.items() if v.strip()}
        job, error = JobService.update_job(job_id, data)
        
        if error:
            return JsonResponse({'error': error}, status=400)
        
        return JsonResponse({
            'id': job.id,
            'title': job.title,
            'company_name': job.company_name,
            'work_type': job.work_type,
            'location': job.location,
            'salary': job.salary,
            'listing_date': job.listing_date.strftime("%Y-%m-%d"),
            'keyword': job.keyword
        }, status=200)
        
    return JsonResponse({'error': 'Invalid request method'}, status=405)
        
def export_to_excel(request):
    return JobService.export_to_excel()


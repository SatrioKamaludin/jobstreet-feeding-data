import os
import django

#set up Django env
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'be_django.settings')
django.setup()

from django.utils import timezone
from api.models import Jobs

def create_job(title, company_name, work_type, location, salary, keyword):
    job = Jobs(
        title = title,
        company_name = company_name,
        work_type = work_type,
        location = location,
        salary = salary,
        keyword = keyword,
        listing_date=timezone.now(),
        is_deleted = False
    )
    job.save()

def main():
    data = [
        {"title": "Software Engineer", "company_name": "TechCorp", "work_type": "Full-time", "location": "New York", "salary": "$120,000", "keyword": "python"},
        {"title": "Data Analyst", "company_name": "DataCo", "work_type": "Part-time", "location": "San Francisco", "salary": "$90,000", "keyword": "sql"},
        {"title": "Project Manager", "company_name": "ManageIT", "work_type": "Contract", "location": "Chicago", "salary": "$100,000", "keyword": "management"},
        {"title": "UX Designer", "company_name": "DesignWorks", "work_type": "Full-time", "location": "Seattle", "salary": "$110,000", "keyword": "ux"},
        {"title": "Product Manager", "company_name": "ProductPro", "work_type": "Full-time", "location": "Boston", "salary": "$130,000", "keyword": "product"},
        {"title": "System Administrator", "company_name": "SysAdminCo", "work_type": "Part-time", "location": "Austin", "salary": "$85,000", "keyword": "system"},
        {"title": "Marketing Specialist", "company_name": "MarketMasters", "work_type": "Contract", "location": "Denver", "salary": "$95,000", "keyword": "marketing"},
        {"title": "Web Developer", "company_name": "WebWorks", "work_type": "Full-time", "location": "Los Angeles", "salary": "$115,000", "keyword": "web"},
        {"title": "Business Analyst", "company_name": "BizAnalytica", "work_type": "Full-time", "location": "San Diego", "salary": "$105,000", "keyword": "business"},
        {"title": "Database Administrator", "company_name": "DataSecure", "work_type": "Part-time", "location": "Philadelphia", "salary": "$90,000", "keyword": "database"},
        {"title": "Network Engineer", "company_name": "NetTech", "work_type": "Contract", "location": "Dallas", "salary": "$100,000", "keyword": "network"},
        {"title": "Data Scientist", "company_name": "SciData", "work_type": "Full-time", "location": "San Jose", "salary": "$140,000", "keyword": "data"},
        {"title": "DevOps Engineer", "company_name": "DevOpsWorks", "work_type": "Full-time", "location": "Houston", "salary": "$120,000", "keyword": "devops"},
        {"title": "Content Writer", "company_name": "WriteOn", "work_type": "Part-time", "location": "Atlanta", "salary": "$70,000", "keyword": "content"},
        {"title": "Graphic Designer", "company_name": "DesignCo", "work_type": "Contract", "location": "Miami", "salary": "$80,000", "keyword": "graphic"},
        {"title": "Front-end Developer", "company_name": "FrontEndPro", "work_type": "Full-time", "location": "Orlando", "salary": "$110,000", "keyword": "frontend"},
        {"title": "Back-end Developer", "company_name": "BackEndWorks", "work_type": "Full-time", "location": "Minneapolis", "salary": "$115,000", "keyword": "backend"},
        {"title": "Cloud Engineer", "company_name": "CloudTech", "work_type": "Contract", "location": "Columbus", "salary": "$125,000", "keyword": "cloud"},
        {"title": "Quality Assurance", "company_name": "QAWorks", "work_type": "Part-time", "location": "Cleveland", "salary": "$85,000", "keyword": "qa"},
        {"title": "SEO Specialist", "company_name": "SEOMasters", "work_type": "Full-time", "location": "St. Louis", "salary": "$95,000", "keyword": "seo"},
        {"title": "IT Support Specialist", "company_name": "SupportTech", "work_type": "Full-time", "location": "Kansas City", "salary": "$80,000", "keyword": "support"},
        {"title": "Sales Manager", "company_name": "SalesCorp", "work_type": "Contract", "location": "Indianapolis", "salary": "$105,000", "keyword": "sales"},
    ]

    for entry in data:
        create_job(**entry)

if __name__ == '__main__':
    main()




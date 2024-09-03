from rest_framework import serializers
from .models import Jobs

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = ['id', 'title', 'company_name', 'work_type', 'location', 'salary', 'listing_date', 'keyword', 'added']
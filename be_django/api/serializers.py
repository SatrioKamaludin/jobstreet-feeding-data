# api/serializers.py
from rest_framework import serializers
from .models import Jobs

class JobsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Jobs
        fields = '__all__'
        
    def validate(self, data):
        if self.context.get('is_creation', False):
            required_fields = ['title', 'company_name', 'work_type', 'location', 'salary', 'keyword']
            errors = {}
            
            for field in required_fields:
                if not data.get(field):
                    errors[field] = f"{field.replace('_', ' ').capitalize()} is required."
            
            if errors:
                raise serializers.ValidationError(errors)
        
        return data
    
class JobsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = ['is_deleted'] 
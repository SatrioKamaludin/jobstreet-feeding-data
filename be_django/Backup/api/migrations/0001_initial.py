# Generated by Django 5.1 on 2024-09-03 04:32

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Jobs',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('company_name', models.CharField(max_length=255)),
                ('work_type', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('salary', models.CharField(max_length=255)),
                ('listing_date', models.DateTimeField(auto_now_add=True)),
                ('keyword', models.CharField(max_length=255)),
                ('is_deleted', models.BooleanField(default=False)),
            ],
        ),
    ]

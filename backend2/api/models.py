from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    more_likely_tariff = models.CharField(max_length=255, null=True)
    utility_rate = models.CharField(max_length=255, null=True)

class ProposalUtility(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    openEI_id = models.CharField(max_length=255)
    tariff_name = models.CharField(max_length=100)
    pricing_matrix = models.JSONField()
    average_price=models.IntegerField()
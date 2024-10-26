from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address_input = models.CharField(max_length=255)
    utility_rate_selected = models.DecimalField(max_digits=10, decimal_places=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.address_input} - {self.user.username}"

class ProposalUtility(models.Model):
    project = models.OneToOneField('Project', on_delete=models.CASCADE, related_name='proposal_utility')
    openEI_id = models.CharField(max_length=100)
    tariff_name = models.CharField(max_length=100)
    pricing_matrix = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tariff_name} for {self.project.address_input}"

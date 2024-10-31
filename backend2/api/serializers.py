from rest_framework import serializers
from .models import Project, ProposalUtility

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProposalUtilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalUtility
        fields = "__all__"
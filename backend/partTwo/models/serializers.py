from rest_framework import serializers
from .models import Project, ProposalUtility

class ProposalUtilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalUtility
        fields = ['id', 'openEI_id', 'tariff_name', 'pricing_matrix', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    proposal_utility = ProposalUtilitySerializer()

    class Meta:
        model = Project
        fields = ['id', 'user', 'address_input', 'utility_rate_selected', 'proposal_utility',  'created_at', 'updated_at']
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        proposal_utility_data = validated_data.pop('proposal_utility', None)
        project = Project.objects.create(**validated_data)
        if proposal_utility_data:
            ProposalUtility.objects.create(project=project, **proposal_utility_data)
        return project
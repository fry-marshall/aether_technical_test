from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Project, ProposalUtility
from .serializers import ProjectSerializer, ProposalUtilitySerializer
from rest_framework.response import Response
from rest_framework import status
import base64
from django.contrib.auth.models import User

def get_user_from_basic_auth(request):
    auth = request.META.get('HTTP_AUTHORIZATION', None)
    if auth and auth.startswith('Basic '):
        try:
            token = auth.split(' ')[1]
            decoded = base64.b64decode(token).decode('utf-8')
            username, password = decoded.split(':', 1)
            print("yooooo")
            user = User.objects.get(username=username)
            return user
        except (ValueError, User.DoesNotExist):
            return None
    return None

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = get_user_from_basic_auth(self.request)
        if user:
            serializer.save(user=user)
        else:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    def get_queryset(self):
        user = get_user_from_basic_auth(self.request)
        if user:
            return Project.objects.filter(user=user)
        return Project.objects.none()

class ProposalUtilityViewSet(viewsets.ModelViewSet):
    queryset = ProposalUtility.objects.all()
    serializer_class = ProposalUtilitySerializer
    permission_classes = [IsAuthenticated]
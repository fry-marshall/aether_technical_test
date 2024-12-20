"""
URL configuration for backend2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from api.views import retrieve_utility_data, create_project, create_webhook

urlpatterns = [
    path("admin/", admin.site.urls),
    path("utilityrate/", retrieve_utility_data, name="retrieve_utility_data"),
    path("projects/create", create_project, name="create_project"),
    path("projects/webhook", create_webhook, name="create_webhook")
]

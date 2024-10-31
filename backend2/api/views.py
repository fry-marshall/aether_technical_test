import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Project, ProposalUtility
import base64
from django.contrib.auth.models import User
from .services import tariffPriceEasyMethod, calculateCostForTheFirstYear, graphData

def get_user_from_basic_auth(request):
    auth = request.META.get('HTTP_AUTHORIZATION', None)
    if auth and auth.startswith('Basic '):
        try:
            token = auth.split(' ')[1]
            decoded = base64.b64decode(token).decode('utf-8')
            print(decoded)

            username, password = decoded.split(':', 1)
            user = User.objects.get(username=username)
            print(user)
            return user
        except (ValueError, User.DoesNotExist):
            return None
    return None

@api_view(["POST"])
def retrieve_utility_data(request):
    user = get_user_from_basic_auth(request)
    if user:
        project = Project.objects.create(
            address=request.data.get('address'),
            user=user
        )
    else:
        return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    required_fields = ['address', 'consumption', 'escalator']
    missing_fields = []
    for field in required_fields:
        if field not in request.data:
            missing_fields.append(field)

    if len(missing_fields) < 0:
        return Response({'error': f'Missing fields: {", ".join(missing_fields)}'}, status=400)
    
    escalator = request.data.get('escalator')
    consumption = request.data.get('consumption')

    api_key = "VOeIh4rvwI0CjtMciHqOMb04ax2GQxQIoYuSgMiy"
    effective_on_date = "1640995199"
    address = request.data.get('address')
    url = "https://api.openei.org/utility_rates?version=7&detail=full&format=json&api_key={api_key}&effective_on_date={effective_on_date}&address=${address}".format(api_key=api_key, effective_on_date=effective_on_date, address=address)
    response = requests.get(url).json()
    data = []

    if len(response['items']) > 0:
        for item in response['items']:
            data.append({
                "openEI_id": item['label'],
                "average_price": tariffPriceEasyMethod(item['energyratestructure']),
                "price_first_year": calculateCostForTheFirstYear(item['energyratestructure'], consumption),
                "name": item['name'],
                "utility": item['utility'],
                "is_more_likely_tariff": item.get('is_default', False) and item.get('approved', False),
                "graphdata": graphData(escalator, item['energyratestructure'], consumption),
                'pricing_matrix': item['energyweekdayschedule'],
            })
            if item.get('is_default', False) and item.get('approved', False) == True:
                project.more_likely_tariff = item['name']
                project.save()
        return Response({"items": data }, status=200)
    
    else:
        return Response({"message": "no data available"}, status=400)


@api_view(["POST"])
def create_project(request):
    user = get_user_from_basic_auth(request)
    if user:
        project = Project.objects.create(
            address=request.data.get('address'),
            utility_rate=request.data.get('tariff_name'),
            user=user
        )
    else:
        return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    proposal_utility = ProposalUtility.objects.create(
        project=project,
        openEI_id=request.data.get('openEI_id'),
        tariff_name=request.data.get('tariff_name'),
        pricing_matrix=request.data.get('pricing_matrix'),
        average_price=request.data.get('average_price'),
    )
    
    return Response({
        'project_id': project.id,
        'proposal_utility': proposal_utility.id,
    }, status=201)

@api_view(["POST"])
def create_webhook(request):
    user = get_user_from_basic_auth(request)
    print("yooo")
    if user:
        project = Project.objects.create(address=request.data.get('address'), user=user)
        webhook_url = "https://webhook.site/10a7e99d-1df8-4024-9bca-d1d76d6be10e"
        requests.post(webhook_url, json={'event': 'project_created', 'data': {'id': project.id, 'address': project.address}})
        return Response({'id': project.id, 'address': project.address}, status=201)
    else:
        return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
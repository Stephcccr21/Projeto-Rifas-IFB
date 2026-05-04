from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RaffleViewSet, PrizeViewSet

router = DefaultRouter()

# ✅ FIXED
router.register(r'', RaffleViewSet, basename='raffles')

urlpatterns = [
    path('', include(router.urls)),

    path('<int:raffle_id>/premios/', PrizeViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),

    path('<int:raffle_id>/premios/<int:pk>/', PrizeViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    })),
]
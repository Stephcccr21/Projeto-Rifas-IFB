from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RaffleViewSet,
    PrizeViewSet,
    PublicRaffleView,
    ReservarNumerosView,
)

router = DefaultRouter()

router.register(
    r'',
    RaffleViewSet,
    basename='raffles'
)

router.register(
    r'premios',
    PrizeViewSet,
    basename='premios'
)

urlpatterns = [

    # 🌎 PUBLIC RAFFLE
    path(
        '<slug:slug>/public/',
        PublicRaffleView.as_view(),
        name='public-raffle'
    ),

    # 🛒 RESERVAR NÚMEROS
    path(
        '<int:raffle_id>/reservar/',
        ReservarNumerosView.as_view(),
        name='reservar-numeros'
    ),

    # 🔒 PRIVATE ROUTES
    path('', include(router.urls)),
]
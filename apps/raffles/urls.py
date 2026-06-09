from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResultadoSorteioView
from .views import PublicarRifaView

from .views import (
    RaffleViewSet,
    PrizeViewSet,
    PublicRaffleView,
    ReservarNumerosView,
    SortearRifaView,
)

router = DefaultRouter()
router.register(
    r'premios',
    PrizeViewSet,
    basename='premios'
)

router.register(
    r'',
    RaffleViewSet,
    basename='raffles'
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
    path(
    "<int:raffle_id>/publicar/",
    PublicarRifaView.as_view(),
),
    path(
    "<int:raffle_id>/sortear/",
    SortearRifaView.as_view(),
),

    # 🔒 PRIVATE ROUTES
    path('', include(router.urls)),
    path(
    "<int:raffle_id>/resultados/",
    ResultadoSorteioView.as_view(),
),

]
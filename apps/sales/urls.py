from django.urls import path

from .views import (
    ReservarNumerosView
)

urlpatterns = [

    path(
        "raffle/<int:raffle_id>/reservar/",
        ReservarNumerosView.as_view(),
        name="reservar-numeros"
    ),

]
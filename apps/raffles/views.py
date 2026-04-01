from django.shortcuts import render
from rest_framework import viewsets
from .models import Raffle
from .serializers import RaffleSerializer

class RaffleViewSet(viewsets.ModelViewSet):
    queryset = Raffle.objects.all()
    serializer_class = RaffleSerializer

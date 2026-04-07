from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Raffle
from .serializers import RaffleSerializer
from apps.users.permissions import IsOrganizer
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Raffle
from .serializers import RaffleSerializer


# 🎯 CREATE raffle (ONLY organizer)
class CreateRaffleView(CreateAPIView):
    queryset = Raffle.objects.all()
    serializer_class = RaffleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # 🔐 Only organizers can create raffles
        if user.role != 'organizer':
            raise PermissionError("Only organizers can create raffles")

        serializer.save(organizer=user)


# 📋 LIST raffles (public)
class ListRafflesView(ListAPIView):
    queryset = Raffle.objects.all()
    serializer_class = RaffleSerializer
    permission_classes = [AllowAny]


class RaffleViewSet(ModelViewSet):
    queryset = Raffle.objects.all()
    serializer_class = RaffleSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsOrganizer()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
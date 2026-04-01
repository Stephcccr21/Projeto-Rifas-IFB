from rest_framework import serializers
from .models import Raffle, Prize

class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = '__all__'


class RaffleSerializer(serializers.ModelSerializer):
    prizes = PrizeSerializer(many=True, read_only=True)

    class Meta:
        model = Raffle
        fields = '__all__'
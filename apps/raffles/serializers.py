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
        read_only_fields = ['organizer']

    def create(self, validated_data):
        prizes_data = validated_data.pop('prizes', [])
        raffle = Raffle.objects.create(**validated_data)

        for prize_data in prizes_data:
            Prize.objects.create(raffle=raffle, **prize_data)

        return raffle

from django.db import models
from django.conf import settings
from apps.raffles.models import Raffle

from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
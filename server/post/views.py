from django.shortcuts import render
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.sessions.models import Session



# Create your views here.
class Replys(APIView):
    def get(self, request: HttpRequest, u_sq: int, p_sq: int)-> Response:
        # TODO : data query
        data={
            'u_sq':u_sq,
            'p_sq':p_sq
        }

        return Response(data=data, status=status.HTTP_200_OK)
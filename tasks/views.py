from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Task
from .serializers import TaskSerializer
from django.shortcuts import render

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

def task_list(request):
    return render(request, 'tasks/task_list.html')

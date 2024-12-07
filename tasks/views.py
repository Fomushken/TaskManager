from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer
from django.shortcuts import render

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['patch'])
    def change_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Task.STATUS_CHOICES):
            task.status = new_status
            task.save()
            return Response({'status': 'success', 'task': TaskSerializer(task).data})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

def task_list(request):
    return render(request, 'tasks/task_list.html')

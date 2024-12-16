from datetime import datetime

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task
from .serializers import TaskSerializer
from django.shortcuts import render

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'due_date']
    ordering_fields = ['due_date', 'status']
    ordering = ['due_date']

    @action(detail=True, methods=['patch'])
    def change_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Task.STATUS_CHOICES):
            task.status = new_status
            task.save()
            return Response({'status': 'success', 'task': TaskSerializer(task).data})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = super().get_queryset()

        due_date_filter = self.request.query_params.get('due_date')
        status_filter = self.request.query_params.get('status')

        print(f"Query Params: {self.request.query_params}")
        print(f"Due Date Filter: {due_date_filter}")

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        if due_date_filter:
            try:
                parsed_due_date = datetime.strptime(due_date_filter, '%Y-%m-%d').date()
                queryset = queryset.filter(due_date__date=parsed_due_date)
                print(queryset)
            except ValueError:
                print("Invalid date format. Expected YYYY-MM-DD.")

        return queryset

def task_list(request):
    return render(request, 'tasks/task_list.html')

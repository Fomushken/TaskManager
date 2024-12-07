from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, task_list

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', task_list, name='task_list'),
    path('api/', include(router.urls)),
]


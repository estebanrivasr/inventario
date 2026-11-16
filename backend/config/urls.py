from django.contrib import admin
from django.urls import path, include  # <-- 1. Importa 'include'
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('inventario.urls')),  # <-- 2. Agrega esta línea para enlazar las rutas de tu app
]
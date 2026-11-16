from django.urls import path
from .views import productos_catalogo_view, perfil_view  # Asegúrate de que coincidan con los nombres en tus views.py

urlpatterns = [
    path('productos-catalogo/', productos_catalogo_view, name='productos_catalogo'),
    path('perfil/', perfil_view, name='perfil'),
]

from django.urls import path
from . import views

urlpatterns = [
    path(
        'registro/',
        views.RegistroUsuarioView.as_view(),
        name='registro'
    ),
    path(
        'productos-catalogo/',
        views.productos_catalogo_view,
        name='productos_catalogo'
    ),
    path(
        'perfil/',
        views.perfil_view,
        name='perfil'
    ),
]
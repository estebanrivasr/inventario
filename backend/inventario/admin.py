from django.contrib import admin
from .models import Proveedor, Categoria, Producto

admin.site.register(Proveedor)
admin.site.register(Categoria)  # <-- Asegúrate de tener esta línea
admin.site.register(Producto)
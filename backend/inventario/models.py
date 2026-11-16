from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    contacto = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    
    # Relación con Proveedor (Uno a Muchos)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name='productos', null=True, blank=True)
    
    # Relación con Categoria (Muchos a Muchos)
    categorias = models.ManyToManyField(Categoria, related_name='productos')

    def __str__(self):
        return self.nombre
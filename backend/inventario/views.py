from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import RegistroUsuarioSerializer

# Importaciones de tu modelo y serializador
from .models import Producto
from .serializers import ProductoRelacionalSerializer


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def productos_catalogo_view(request):
    # 1. Obtener el queryset base
    queryset = Producto.objects.all()

    # 2. Aplicar filtros opcionales por parámetros en la URL
    ciudad = request.GET.get('ciudad', None)
    if ciudad:
        queryset = queryset.filter(proveedor__nombre__icontains=ciudad)

    con_stock = request.GET.get('con_stock', None)
    if con_stock is not None and con_stock.lower() == 'true':
        queryset = queryset.filter(stock__gt=0)

    # 3. Serialización y respuesta
    serializer = ProductoRelacionalSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def perfil_view(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email
    })

class RegistroUsuarioView(CreateAPIView):
    serializer_class = RegistroUsuarioSerializer
    permission_classes = [AllowAny]
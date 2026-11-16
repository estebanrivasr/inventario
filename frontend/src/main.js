
import './style.css';

import { login, logout } from './auth.js';
import { peticionAPI } from './api.js';


// =====================================
// 1. REFERENCIAS HTML
// =====================================

const sectionLogin = document.getElementById('section-login');
const sectionPerfil = document.getElementById('section-perfil');

const userControls = document.getElementById('user-controls');
const userInfo = document.getElementById('user-info');

const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');

const formFiltros = document.getElementById('form-filtros');
const btnLimpiar = document.getElementById('btn-limpiar');

const inputCiudad = document.getElementById('filtro-ciudad');
const inputPrecio = document.getElementById('filtro-precio');
const inputStock = document.getElementById('filtro-stock');

const contenedorProductos = document.getElementById('contenedor-productos');
const estadoCatalogo = document.getElementById('estado-catalogo');


// =====================================
// 2. MOSTRAR Y OCULTAR PANTALLAS
// =====================================

function mostrarLogin() {

    sectionLogin.classList.remove('hidden');
    sectionPerfil.classList.add('hidden');
    userControls.classList.add('hidden');

}

function mostrarPerfil(username = 'Autenticado') {

    sectionLogin.classList.add('hidden');
    sectionPerfil.classList.remove('hidden');
    userControls.classList.remove('hidden');

    userInfo.textContent = `Usuario: ${username}`;

}


// =====================================
// 3. INICIAR SESIÓN
// =====================================

formLogin.addEventListener('submit', async (e) => {

    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Completa ambos campos.');
        return;
    }

    const boton = formLogin.querySelector('button[type="submit"]');

    boton.disabled = true;
    boton.textContent = 'Iniciando sesión...';

    try {

        // Validar usuario y contraseña con Django
        await login(username, password);

        console.log('Usuario autenticado correctamente.');

        // Mostrar catálogo
        mostrarPerfil(username);

        // Cargar productos
        await cargarCatalogo();

        // Limpiar contraseña
        document.getElementById('password').value = '';

    } catch (error) {

        console.error('Error de autenticación:', error);

        alert(error.message);

    } finally {

        boton.disabled = false;
        boton.textContent = 'Entrar al Sistema';

    }

});


// =====================================
// 4. CERRAR SESIÓN
// =====================================

btnLogout.addEventListener('click', () => {

    logout();

});


// =====================================
// 5. CARGAR CATÁLOGO DE PRODUCTOS
// =====================================

async function cargarCatalogo() {

    estadoCatalogo.textContent = 'Cargando productos...';

    contenedorProductos.innerHTML = '';

    try {

        const params = new URLSearchParams();

        // Filtro por ciudad
        if (inputCiudad.value.trim()) {

            params.append(
                'ciudad',
                inputCiudad.value.trim()
            );

        }

        // Filtro por precio máximo
        if (inputPrecio.value.trim()) {

            params.append(
                'precio_max',
                inputPrecio.value.trim()
            );

        }

        // Filtro por disponibilidad
        if (inputStock.checked) {

            params.append('con_stock', 'true');

        }

        const queryString = params.toString();

        const endpoint = queryString
            ? `/productos-catalogo/?${queryString}`
            : '/productos-catalogo/';

        // Consultar Django utilizando JWT
        const response = await peticionAPI(endpoint, 'GET');

        // Comprobar si el token expiró
        if (response.status === 401) {

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            mostrarLogin();

            throw new Error(
                'Tu sesión expiró. Inicia sesión nuevamente.'
            );

        }

        if (!response.ok) {

            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.detail || `Error HTTP ${response.status}`
            );

        }

        const data = await response.json();

        // Compatible con respuestas normales y paginadas
        const productos = Array.isArray(data)
            ? data
            : data.results;

        if (!Array.isArray(productos)) {

            throw new Error(
                'La respuesta de Django no contiene una lista de productos.'
            );

        }

        renderizarProductos(productos);

    } catch (error) {

        console.error('Error al cargar productos:', error);

        estadoCatalogo.textContent = error.message;

    }

}


// =====================================
// 6. PROTEGER TEXTO INSERTADO EN HTML
// =====================================

function escaparHTML(valor) {

    return String(valor ?? '').replace(/[&<>"']/g, caracter => ({

        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'

    })[caracter]);

}


// =====================================
// 7. MOSTRAR PRODUCTOS
// =====================================

function renderizarProductos(productos) {

    contenedorProductos.innerHTML = '';

    if (productos.length === 0) {

        estadoCatalogo.textContent =
            'No se encontraron productos.';

        return;

    }

    estadoCatalogo.textContent =
        `Mostrando ${productos.length} producto(s).`;

    const tarjetasHTML = productos.map(producto => {

        const nombre = escaparHTML(producto.nombre);

        const descripcion = escaparHTML(producto.descripcion);

        const precio = Number(producto.precio || 0).toFixed(2);

        const proveedor = escaparHTML(
            producto.proveedor_nombre || 'No especificado'
        );

        const ciudad = escaparHTML(
            producto.proveedor_ciudad ||
            producto.ciudad ||
            'No especificada'
        );

        const stock = Number(producto.stock || 0);

        // Categorías
        const categorias = Array.isArray(producto.categorias)
            ? producto.categorias
            : [];

        const categoriasHTML = categorias.length > 0

            ? categorias.map(cat => {

                const nombreCategoria =
                    typeof cat === 'object' ? cat.nombre : cat;

                return `
                    <span class="badge-categoria">
                        ${escaparHTML(nombreCategoria)}
                    </span>
                `;

            }).join('')

            : '<span class="badge-categoria">Sin categoría</span>';

        // Disponibilidad
        const claseStock = stock > 0
            ? 'stock-disponible'
            : 'stock-agotado';

        const textoStock = stock > 0
            ? `${stock} disponibles`
            : 'Agotado';

        return `

            <article class="producto-card">

                <div>

                    <div class="card-header">

                        <h3 class="card-title">
                            ${nombre}
                        </h3>

                        <span class="card-precio">
                            $${precio}
                        </span>

                    </div>

                    <p>${descripcion || 'Sin descripción'}</p>

                    <p class="card-proveedor">
                        Proveedor:
                        <strong>${proveedor}</strong>
                        (${ciudad})
                    </p>

                </div>

                <div class="card-categorias">
                    ${categoriasHTML}
                </div>

                <div class="card-footer">

                    <span>ID #${escaparHTML(producto.id)}</span>

                    <span class="stock-badge ${claseStock}">
                        ${textoStock}
                    </span>

                </div>

            </article>

        `;

    }).join('');

    contenedorProductos.innerHTML = tarjetasHTML;

}


// =====================================
// 8. APLICAR FILTROS
// =====================================

formFiltros.addEventListener('submit', async (e) => {

    e.preventDefault();

    await cargarCatalogo();

});


// =====================================
// 9. LIMPIAR FILTROS
// =====================================

btnLimpiar.addEventListener('click', async () => {

    formFiltros.reset();

    await cargarCatalogo();

});


// =====================================
// 10. VERIFICAR SESIÓN AL ABRIR
// =====================================

async function verificarEstadoSesion() {

    const token = localStorage.getItem('access_token');

    if (token) {

        mostrarPerfil();

        await cargarCatalogo();

    } else {

        mostrarLogin();

    }

}


// =====================================
// 11. INICIAR APLICACIÓN
// =====================================

verificarEstadoSesion();

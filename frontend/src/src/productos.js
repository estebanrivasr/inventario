import { peticionAPI } from './api.js';

/**
 * Consulta el catálogo de productos aplicando filtros opcionales en la URL.
 * @param {Object} filtros - Objeto con propiedades opcionales: ciudad, precio_max, con_stock
 */
export async function obtenerProductos(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.ciudad && filtros.ciudad.trim() !== '') {
    params.append('ciudad', filtros.ciudad.trim());
  }

  if (filtros.precio_max && filtros.precio_max !== '') {
    params.append('precio_max', filtros.precio_max);
  }

  if (filtros.con_stock) {
    params.append('con_stock', 'true');
  }

  const queryString = params.toString();
  const endpoint = queryString
    ? `/productos-catalogo/?${queryString}`
    : '/productos-catalogo/';

  // El cuarto parámetro (true) indica que se debe enviar el Bearer Token
  const response = await peticionAPI(endpoint, 'GET', null, true);

  if (!response.ok) {
    throw new Error(`Error al consultar el catálogo (Código ${response.status})`);
  }

  return await response.json();
}
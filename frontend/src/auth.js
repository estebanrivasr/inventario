

import { peticionAPI } from './api.js';

// =====================================
// INICIAR SESIÓN
// =====================================

export async function login(username, password) {

    const response = await peticionAPI(
        '/token/',
        'POST',
        {
            username: username,
            password: password
        },
        false
    );

    const data = await response.json();

    // Comprobar respuesta de Django
    if (!response.ok) {
        throw new Error(
            data.detail || 'Usuario o contraseña incorrectos.'
        );
    }

    // Comprobar que Django haya devuelto el access token
    if (!data.access) {
        throw new Error('Django no devolvió un token de acceso.');
    }

    // Guardar tokens
    localStorage.setItem('access_token', data.access);

    if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
    }

    console.log('Autenticación correcta.');

    return data;
}


// =====================================
// CERRAR SESIÓN
// =====================================

export function logout() {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    window.location.reload();
}

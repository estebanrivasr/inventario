
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function peticionAPI(
    endpoint,
    method = 'GET',
    data = null,
    requiereAuth = true
) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Agregar token JWT cuando la petición lo requiera
    if (requiereAuth) {
        const token = localStorage.getItem('access_token');

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const options = {
        method: method,
        headers: headers
    };

    // Enviar información cuando exista
    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            options
        );

        return response;

    } catch (error) {
        console.error('Error de conexión con Django:', error);

        throw new Error(
            'No se pudo conectar con el servidor Django.'
        );
    }
}

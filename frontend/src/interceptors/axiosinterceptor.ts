import axios from "axios";

// Lista de rutas que no deben ser interceptadas
const EXCLUDED_ROUTES = ["/login", "/register"];

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

// Interceptor de solicitud
api.interceptors.request.use(
    (request) => {
        // Verificar si la URL está en la lista de excluidas
        if (EXCLUDED_ROUTES.some((route) => request.url?.includes(route))) {
            return request;
        }
        
        // Obtener token de Firebase (o token tradicional)
        const token = localStorage.getItem("token");
        
        // Agregar token si existe
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log("No autorizado, redirigiendo a login...");
            
            // Limpiar datos de sesión
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Redirigir al login
            window.location.href = "/auth/signin";
        }
        return Promise.reject(error);
    }
);

export default api;
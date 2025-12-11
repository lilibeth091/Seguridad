// frontend/src/models/User.ts
export interface User {
    id?: string | number;
    name?: string;
    email?: string;
    password?: string;
    photoURL?: string; // Foto de perfil de Google
    provider?: 'google' | 'email'; // Proveedor de autenticación
    createdAt?: Date;
    updatedAt?: Date;
}
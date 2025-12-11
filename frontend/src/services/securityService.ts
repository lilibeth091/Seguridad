// frontend/src/services/securityService.ts
import axios from "axios";
import { User } from "../models/User";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.config';

class SecurityService extends EventTarget {
    keySession: string;
    API_URL: string;
    user: User;
    theAuthProvider: any;
    
    constructor() {
        super();

        this.keySession = 'session';
        this.API_URL = import.meta.env.VITE_API_URL || "";
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        } else {
            this.user = {};
        }

        // Listener para cambios de autenticación
        this.initAuthListener();
    }

    // Inicializar listener de autenticación
    private initAuthListener() {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                this.handleFirebaseUser(firebaseUser);
            } else {
                this.logout();
            }
        });
    }

    // Convertir usuario de Firebase a User del sistema
    private async handleFirebaseUser(firebaseUser: FirebaseUser) {
        const token = await firebaseUser.getIdToken();
        
        const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined
        };

        // Guardar token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.user = user;
        store.dispatch(setUser(user));
        
        this.dispatchEvent(new CustomEvent("userChange", { detail: user }));
    }

    // Login con Google (OAuth)
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            console.log('Usuario autenticado con Google:', user);
            console.log('Token:', token);

            // El listener onAuthStateChanged se encargará del resto
            return {
                success: true,
                user: {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }
            };
        } catch (error: any) {
            console.error('Error durante login con Google:', error);
            
            // Manejo de errores específicos
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Popup cerrado por el usuario');
            } else if (error.code === 'auth/cancelled-popup-request') {
                throw new Error('Solicitud cancelada');
            }
            
            throw error;
        }
    }

    // Login tradicional (mantener compatibilidad)
    async login(user: User) {
        console.log("llamando api " + `${this.API_URL}/login`);
        try {
            const response = await axios.post(`${this.API_URL}/login`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            
            // Guardar token si viene en la respuesta
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            store.dispatch(setUser(data));
            this.user = data;
            
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    
    getUser() {
        return this.user;
    }
    
    async logout() {
        try {
            // Cerrar sesión en Firebase
            await signOut(auth);
            
            // Limpiar datos locales
            this.user = {};
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
            store.dispatch(setUser(null));
            
            console.log('Sesión cerrada correctamente');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw error;
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return token !== null && user !== null;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    // Obtener el usuario actual de Firebase
    getCurrentFirebaseUser() {
        return auth.currentUser;
    }
}

export default new SecurityService();
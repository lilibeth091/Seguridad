import { Permission } from "../models/Permission";
import api from "../interceptors/axiosinterceptor";

class PermissionService {
  async getPermissions(): Promise<Permission[]> {
    try {
      const response = await api.get<Permission[]>("/permissions");
      return response.data;
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      throw error;
    }
  }

  async getPermissionById(id: number): Promise<Permission> {
    try {
      const response = await api.get<Permission>(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener permiso:", error);
      throw error;
    }
  }

  async createPermission(permission: Omit<Permission, "id" | "created_at" | "updated_at">): Promise<Permission> {
    try {
      const response = await api.post<Permission>("/permissions", permission);
      return response.data;
    } catch (error) {
      console.error("Error al crear permiso:", error);
      throw error;
    }
  }

  async updatePermission(id: number, permission: Partial<Permission>): Promise<Permission> {
    try {
      const response = await api.put<Permission>(`/permissions/${id}`, permission);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar permiso:", error);
      throw error;
    }
  }

  async deletePermission(id: number): Promise<void> {
    try {
      await api.delete(`/permissions/${id}`);
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
      throw error;
    }
  }
}

export const permissionService = new PermissionService();

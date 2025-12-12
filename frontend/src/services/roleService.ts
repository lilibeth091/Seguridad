import { Role } from "../models/Role";
import api from "../interceptors/axiosinterceptor";

class RoleService {
  async getRoles(): Promise<Role[]> {
    try {
      const response = await api.get<Role[]>("/roles");
      return response.data;
    } catch (error) {
      console.error("Error al obtener roles:", error);
      throw error;
    }
  }

  async getRoleById(id: number): Promise<Role> {
    try {
      const response = await api.get<Role>(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener rol:", error);
      throw error;
    }
  }

  async createRole(role: Omit<Role, "id" | "created_at" | "updated_at">): Promise<Role> {
    try {
      const response = await api.post<Role>("/roles", role);
      return response.data;
    } catch (error) {
      console.error("Error al crear rol:", error);
      throw error;
    }
  }

  async updateRole(id: number, role: Partial<Role>): Promise<Role> {
    try {
      const response = await api.put<Role>(`/roles/${id}`, role);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw error;
    }
  }

  async deleteRole(id: number): Promise<void> {
    try {
      await api.delete(`/roles/${id}`);
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      throw error;
    }
  }
}

export const roleService = new RoleService();

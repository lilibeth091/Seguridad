import { UserRole } from "../models/UserRole";
import api from "../interceptors/axiosinterceptor";

class UserRoleService {
  async getUserRoles(): Promise<UserRole[]> {
    try {
      const response = await api.get<UserRole[]>("/user-roles");
      return response.data;
    } catch (error) {
      console.error("Error al obtener asignaciones usuario-rol:", error);
      throw error;
    }
  }

  async getUserRolesByUserId(userId: number): Promise<UserRole[]> {
    try {
      const response = await api.get<UserRole[]>(`/user-roles/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener roles del usuario:", error);
      throw error;
    }
  }

  async getUserRolesByRoleId(roleId: number): Promise<UserRole[]> {
    try {
      const response = await api.get<UserRole[]>(`/user-roles/role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios del rol:", error);
      throw error;
    }
  }

  async createUserRole(userId: number, roleId: number, data: { startAt: string; endAt: string }): Promise<UserRole> {
    try {
      const response = await api.post<UserRole>(`/user-roles/user/${userId}/role/${roleId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al crear asignación usuario-rol:", error);
      throw error;
    }
  }

  async deleteUserRole(userId: number, roleId: number): Promise<void> {
    try {
      await api.delete(`/user-roles/user/${userId}/role/${roleId}`);
    } catch (error) {
      console.error("Error al eliminar asignación usuario-rol:", error);
      throw error;
    }
  }
}

export const userRoleService = new UserRoleService();

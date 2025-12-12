import { RolePermission } from "../models/RolePermission";
import api from "../interceptors/axiosinterceptor";

class RolePermissionService {
  async getRolePermissions(): Promise<RolePermission[]> {
    try {
      const response = await api.get<RolePermission[]>("/role-permissions");
      return response.data;
    } catch (error) {
      console.error("Error al obtener asignaciones rol-permiso:", error);
      throw error;
    }
  }

  async getRolePermissionsByRoleId(roleId: number): Promise<RolePermission[]> {
    try {
      const response = await api.get<RolePermission[]>(`/role-permissions/role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener permisos del rol:", error);
      throw error;
    }
  }

  async getRolePermissionsByPermissionId(permissionId: number): Promise<RolePermission[]> {
    try {
      const response = await api.get<RolePermission[]>(`/role-permissions/permission/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener roles con el permiso:", error);
      throw error;
    }
  }

  async createRolePermission(roleId: number, permissionId: number): Promise<RolePermission> {
    try {
      const response = await api.post<RolePermission>(`/role-permissions/role/${roleId}/permission/${permissionId}`, {});
      return response.data;
    } catch (error) {
      console.error("Error al crear asignación rol-permiso:", error);
      throw error;
    }
  }

  async deleteRolePermission(roleId: number, permissionId: number): Promise<void> {
    try {
      await api.delete(`/role-permissions/role/${roleId}/permission/${permissionId}`);
    } catch (error) {
      console.error("Error al eliminar asignación rol-permiso:", error);
      throw error;
    }
  }
}

export const rolePermissionService = new RolePermissionService();

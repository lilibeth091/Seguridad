import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Shield, Key, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { Role, Permission, UserRole, RolePermission } from '../models';
import { User } from '../models/User';
import {
  roleService,
  permissionService,
  userRoleService,
  rolePermissionService,
  userService
} from '../services';

// Componente principal
const SecurityCRUDSystem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('roles');

  // Leer el parámetro 'tab' de la URL al cargar
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['roles', 'permissions', 'userRoles', 'rolePermissions'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Función para cambiar de pestaña y actualizar la URL
  const handleTabChange = (tab: string, roleId?: string) => {
    setActiveTab(tab);
    if (roleId) {
      setSearchParams({ tab, roleId });
    } else {
      setSearchParams({ tab });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Seguridad</h1>
        <p className="text-gray-600">Gestión de Roles, Permisos y Asignaciones</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-50">
          <nav className="flex -mb-px overflow-x-auto">
            <TabButton
              active={activeTab === 'roles'}
              onClick={() => handleTabChange('roles')}
              icon={<Shield className="w-4 h-4" />}
              label="Roles"
            />
            <TabButton
              active={activeTab === 'permissions'}
              onClick={() => handleTabChange('permissions')}
              icon={<Key className="w-4 h-4" />}
              label="Permisos"
            />
            <TabButton
              active={activeTab === 'userRoles'}
              onClick={() => handleTabChange('userRoles')}
              icon={<Users className="w-4 h-4" />}
              label="Usuario-Rol"
            />
            <TabButton
              active={activeTab === 'rolePermissions'}
              onClick={() => handleTabChange('rolePermissions')}
              icon={<Check className="w-4 h-4" />}
              label="Rol-Permiso"
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'roles' && (
            <RolesCRUD
              onViewUsers={(roleId) => handleTabChange('userRoles', roleId.toString())}
              onViewPermissions={(roleId) => handleTabChange('rolePermissions', roleId.toString())}
            />
          )}
          {activeTab === 'permissions' && <PermissionsCRUD />}
          {activeTab === 'userRoles' && <UserRolesCRUD filterRoleId={searchParams.get('roleId')} />}
          {activeTab === 'rolePermissions' && <RolePermissionsCRUD filterRoleId={searchParams.get('roleId')} />}
        </div>
      </div>
    </div>
  );
};

// Componente de botón de tab
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      active
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

// CRUD de Roles
interface RolesCRUDProps {
  onViewUsers: (roleId: number) => void;
  onViewPermissions: (roleId: number) => void;
}

const RolesCRUD: React.FC<RolesCRUDProps> = ({ onViewUsers, onViewPermissions }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error('Error al cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      if (editingRole) {
        await roleService.updateRole(editingRole.id, formData);
        toast.success('Rol actualizado exitosamente');
      } else {
        await roleService.createRole(formData);
        toast.success('Rol creado exitosamente');
      }
      await fetchRoles();
      closeModal();
    } catch (error: any) {
      console.error('Error saving role:', error);
      toast.error(error.message || 'Error al guardar el rol');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este rol?')) return;

    try {
      await roleService.deleteRole(id);
      await fetchRoles();
      toast.success('Rol eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error(error.message || 'Error al eliminar el rol');
    }
  };

  const openModal = (role: Role | null = null) => {
    setEditingRole(role);
    setFormData(role ? { name: role.name, description: role.description } : { name: '', description: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los roles del sistema</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-lg font-semibold text-sm"
          style={{ backgroundColor: '#15803d', color: '#FFFFFF' }}
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Rol</span>
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay roles registrados. Haz clic en "Nuevo Rol" para crear uno.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{role.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{role.description || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewUsers(role.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-semibold"
                        style={{
                          backgroundColor: '#16a34a',
                          color: '#FFFFFF',
                          minWidth: '55px'
                        }}
                      >
                        VER
                      </button>
                      <button
                        onClick={() => openModal(role)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-semibold"
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#FFFFFF',
                          minWidth: '70px'
                        }}
                      >
                        EDITAR
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-semibold"
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#FFFFFF',
                          minWidth: '80px'
                        }}
                      >
                        ELIMINAR
                      </button>
                      <button
                        onClick={() => onViewPermissions(role.id)}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-semibold"
                        style={{
                          backgroundColor: '#9333ea',
                          color: '#FFFFFF',
                          minWidth: '85px'
                        }}
                      >
                        PERMISOS
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editingRole ? 'Editar Rol' : 'Nuevo Rol'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Administrador"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del rol..."
                disabled={submitting}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                disabled={submitting}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Guardando...' : 'ACEPTAR'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// CRUD de Permisos
const PermissionsCRUD: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ url: '', method: 'GET', entity: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await permissionService.getPermissions();
      setPermissions(data);
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
      toast.error('Error al cargar los permisos');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      if (editingPermission) {
        await permissionService.updatePermission(editingPermission.id, formData);
        toast.success('Permiso actualizado exitosamente');
      } else {
        await permissionService.createPermission(formData);
        toast.success('Permiso creado exitosamente');
      }
      await fetchPermissions();
      closeModal();
    } catch (error: any) {
      console.error('Error saving permission:', error);
      toast.error(error.message || 'Error al guardar el permiso');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este permiso?')) return;

    try {
      await permissionService.deletePermission(id);
      await fetchPermissions();
      toast.success('Permiso eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      toast.error(error.message || 'Error al eliminar el permiso');
    }
  };

  const openModal = (permission: Permission | null = null) => {
    setEditingPermission(permission);
    setFormData(
      permission
        ? { url: permission.url, method: permission.method, entity: permission.entity }
        : { url: '', method: 'GET', entity: '' }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPermission(null);
    setFormData({ url: '', method: 'GET', entity: '' });
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Permisos</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los permisos de las APIs</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-lg font-semibold text-sm"
          style={{ backgroundColor: '#15803d', color: '#FFFFFF' }}
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Permiso</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
              <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay permisos registrados. Haz clic en "Nuevo Permiso" para crear uno.
                </td>
              </tr>
            ) : (
              permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{permission.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{permission.url}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(permission.method)}`}>
                      {permission.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{permission.entity}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(permission)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-semibold"
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#FFFFFF',
                          minWidth: '70px'
                        }}
                      >
                        EDITAR
                      </button>
                      <button
                        onClick={() => handleDelete(permission.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-semibold"
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#FFFFFF',
                          minWidth: '80px'
                        }}
                      >
                        ELIMINAR
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editingPermission ? 'Editar Permiso' : 'Nuevo Permiso'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="/api/users"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.entity}
                onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                placeholder="users"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                disabled={submitting}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Guardando...' : 'ACEPTAR'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// CRUD de Usuario-Rol
interface UserRolesCRUDProps {
  filterRoleId?: string | null;
}

const UserRolesCRUD: React.FC<UserRolesCRUDProps> = ({ filterRoleId }) => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    role_id: '',
    startAt: '',
    endAt: '',
  });

  // Filtrar userRoles por roleId si se proporciona
  const filteredUserRoles = filterRoleId
    ? userRoles.filter(ur => ur.role_id === parseInt(filterRoleId))
    : userRoles;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRolesData, usersData, rolesData] = await Promise.all([
        userRoleService.getUserRoles(),
        userService.getUsers(),
        roleService.getRoles(),
      ]);

      setUserRoles(userRolesData);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
      setUserRoles([]);
      setUsers([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      await userRoleService.createUserRole(
        parseInt(formData.user_id),
        parseInt(formData.role_id),
        {
          startAt: formData.startAt,
          endAt: formData.endAt,
        }
      );
      await fetchData();
      closeModal();
      toast.success('Asignación creada exitosamente');
    } catch (error: any) {
      console.error('Error saving user-role:', error);
      toast.error(error.message || 'Error al crear la asignación');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: number, roleId: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignación?')) return;

    try {
      await userRoleService.deleteUserRole(userId, roleId);
      await fetchData();
      toast.success('Asignación eliminada exitosamente');
    } catch (error: any) {
      console.error('Error deleting user-role:', error);
      toast.error(error.message || 'Error al eliminar la asignación');
    }
  };

  const openModal = () => {
    const now = new Date();
    const startAt = now.toISOString().slice(0, 16);
    const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const endAt = endDate.toISOString().slice(0, 16);

    setFormData({
      user_id: '',
      role_id: '',
      startAt,
      endAt,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ user_id: '', role_id: '', startAt: '', endAt: '' });
    setSubmitting(false);
  };

  const getUserName = (userId: number): string => users.find((u) => u.id === userId)?.name || 'N/A';
  const getRoleName = (roleId: number): string => roles.find((r) => r.id === roleId)?.name || 'N/A';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asignación Usuario-Rol</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filterRoleId
              ? `Mostrando usuarios con rol: ${getRoleName(parseInt(filterRoleId))}`
              : 'Asigna roles a los usuarios del sistema'
            }
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-lg font-semibold text-sm"
          style={{ backgroundColor: '#15803d', color: '#FFFFFF' }}
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Asignación</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUserRoles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {filterRoleId
                    ? `No hay usuarios asignados al rol: ${getRoleName(parseInt(filterRoleId))}`
                    : 'No hay asignaciones registradas. Haz clic en "Nueva Asignación" para crear una.'
                  }
                </td>
              </tr>
            ) : (
              filteredUserRoles.map((userRole) => (
                <tr key={userRole.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{getUserName(userRole.user_id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {getRoleName(userRole.role_id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(userRole.startAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {userRole.endAt
                      ? new Date(userRole.endAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Sin límite'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(userRole.user_id, userRole.role_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-semibold"
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#FFFFFF',
                        minWidth: '80px'
                      }}
                    >
                      ELIMINAR
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nueva Asignación Usuario-Rol" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="">Seleccionar usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startAt}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                disabled={submitting}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creando...' : 'ACEPTAR'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// CRUD de Rol-Permiso
interface RolePermissionsCRUDProps {
  filterRoleId?: string | null;
}

const RolePermissionsCRUD: React.FC<RolePermissionsCRUDProps> = ({ filterRoleId }) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ role_id: '', permission_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolePermissionsData, rolesData, permissionsData] = await Promise.all([
        rolePermissionService.getRolePermissions(),
        roleService.getRoles(),
        permissionService.getPermissions(),
      ]);

      setRolePermissions(rolePermissionsData);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      await rolePermissionService.createRolePermission(
        parseInt(formData.role_id),
        parseInt(formData.permission_id)
      );
      await fetchData();
      closeModal();
      toast.success('Asignación creada exitosamente');
    } catch (error: any) {
      console.error('Error saving role-permission:', error);
      toast.error(error.message || 'Error al crear la asignación');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (roleId: number, permissionId: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignación?')) return;

    try {
      await rolePermissionService.deleteRolePermission(roleId, permissionId);
      await fetchData();
      toast.success('Asignación eliminada exitosamente');
    } catch (error: any) {
      console.error('Error deleting role-permission:', error);
      toast.error(error.message || 'Error al eliminar la asignación');
    }
  };

  const openModal = () => {
    setFormData({ role_id: '', permission_id: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ role_id: '', permission_id: '' });
    setSubmitting(false);
  };

  const getRoleName = (roleId: number): string => roles.find((r) => r.id === roleId)?.name || 'N/A';
  const getPermissionInfo = (permissionId: number): string => {
    const perm = permissions.find((p) => p.id === permissionId);
    return perm ? `${perm.method} ${perm.url}` : 'N/A';
  };

  // Función para verificar si un rol tiene un permiso específico
  const hasPermission = (roleId: number, permissionId: number): boolean => {
    return rolePermissions.some(rp => rp.role_id === roleId && rp.permission_id === permissionId);
  };

  // Función para toggle de permisos en la matriz
  const togglePermission = async (roleId: number, permissionId: number, currentlyHas: boolean) => {
    try {
      if (currentlyHas) {
        // Eliminar permiso
        await rolePermissionService.deleteRolePermission(roleId, permissionId);
        toast.success('Permiso eliminado exitosamente');
      } else {
        // Agregar permiso
        await rolePermissionService.createRolePermission(roleId, permissionId);
        toast.success('Permiso asignado exitosamente');
      }
      await fetchData();
    } catch (error: any) {
      console.error('Error toggling permission:', error);
      toast.error(error.message || 'Error al modificar el permiso');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Vista de permisos del rol cuando hay filterRoleId
  if (filterRoleId) {
    const roleId = parseInt(filterRoleId);
    const role = roles.find(r => r.id === roleId);

    if (!role) {
      return (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Rol no encontrado</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Permisos del Rol {roleId}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Volver
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Entidad
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Método
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Activo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay permisos disponibles
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {permission.entity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {permission.url}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(permission.method)}`}>
                        {permission.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(roleId, permission.id)}
                        onChange={() => togglePermission(roleId, permission.id, hasPermission(roleId, permission.id))}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Vista de lista normal (sin filtro)
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asignación Rol-Permiso</h2>
          <p className="text-sm text-gray-500 mt-1">Define qué permisos tiene cada rol</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-lg font-semibold text-sm"
          style={{ backgroundColor: '#15803d', color: '#FFFFFF' }}
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Asignación</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permiso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rolePermissions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No hay asignaciones registradas. Haz clic en "Nueva Asignación" para crear una.
                </td>
              </tr>
            ) : (
              rolePermissions.map((rp) => (
                <tr key={rp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {getRoleName(rp.role_id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{getPermissionInfo(rp.permission_id)}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(rp.role_id, rp.permission_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-semibold"
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#FFFFFF',
                        minWidth: '80px'
                      }}
                    >
                      ELIMINAR
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nueva Asignación Rol-Permiso" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permiso <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.permission_id}
                onChange={(e) => setFormData({ ...formData, permission_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="">Seleccionar permiso</option>
                {permissions.map((permission) => (
                  <option key={permission.id} value={permission.id}>
                    {permission.method} - {permission.url} ({permission.entity})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                disabled={submitting}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creando...' : 'ACEPTAR'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Componente Modal reutilizable
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// Utilidad para colores de métodos HTTP
const getMethodColor = (method: string): string => {
  const colors: { [key: string]: string } = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800',
  };
  return colors[method] || 'bg-gray-100 text-gray-800';
};

export default SecurityCRUDSystem;

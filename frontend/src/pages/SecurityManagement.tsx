import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Shield, Key, Users } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Tipos de datos
interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: number;
  url: string;
  method: string;
  entity: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: number;
  role_id: number;
  startAt: string;
  endAt: string;
  created_at: string;
  updated_at: string;
}

interface RolePermission {
  id: string;
  role_id: number;
  permission_id: number;
  created_at: string;
  updated_at: string;
}

// Componente principal
const SecurityCRUDSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('roles');

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Seguridad</h1>
        <p className="text-gray-600">Gestión de Roles, Permisos y Asignaciones</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <TabButton
              active={activeTab === 'roles'}
              onClick={() => setActiveTab('roles')}
              icon={<Shield className="w-4 h-4" />}
              label="Roles"
            />
            <TabButton
              active={activeTab === 'permissions'}
              onClick={() => setActiveTab('permissions')}
              icon={<Key className="w-4 h-4" />}
              label="Permisos"
            />
            <TabButton
              active={activeTab === 'userRoles'}
              onClick={() => setActiveTab('userRoles')}
              icon={<Users className="w-4 h-4" />}
              label="Usuario-Rol"
            />
            <TabButton
              active={activeTab === 'rolePermissions'}
              onClick={() => setActiveTab('rolePermissions')}
              icon={<Check className="w-4 h-4" />}
              label="Rol-Permiso"
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'roles' && <RolesCRUD />}
          {activeTab === 'permissions' && <PermissionsCRUD />}
          {activeTab === 'userRoles' && <UserRolesCRUD />}
          {activeTab === 'rolePermissions' && <RolePermissionsCRUD />}
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
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

// CRUD de Roles
const RolesCRUD: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Roles data:', data);
      setRoles(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRole
        ? `${API_BASE_URL}/roles/${editingRole.id}`
        : `${API_BASE_URL}/roles/`;
      const method = editingRole ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      fetchRoles();
      closeModal();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este rol?')) {
      try {
        await fetch(`${API_BASE_URL}/roles/${id}`, { method: 'DELETE' });
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
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
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Roles</h2>
        <button
          type="button"
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md z-10"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Rol</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay roles registrados
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{role.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{role.description}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(role)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingRole ? (
                  <>
                    <Check className="w-4 h-4" />
                    Actualizar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Crear
                  </>
                )}
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

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/permissions/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Permissions data:', data);
      setPermissions(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPermission
        ? `${API_BASE_URL}/permissions/${editingPermission.id}`
        : `${API_BASE_URL}/permissions/`;
      const method = editingPermission ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      fetchPermissions();
      closeModal();
    } catch (error) {
      console.error('Error saving permission:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este permiso?')) {
      try {
        await fetch(`${API_BASE_URL}/permissions/${id}`, { method: 'DELETE' });
        fetchPermissions();
      } catch (error) {
        console.error('Error deleting permission:', error);
      }
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
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Permisos</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Permiso
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {permissions.map((permission) => (
              <tr key={permission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{permission.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{permission.url}</td>
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(permission.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editingPermission ? 'Editar Permiso' : 'Nuevo Permiso'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="/api/users"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
              <select
                required
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
              <input
                type="text"
                required
                value={formData.entity}
                onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                placeholder="users"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingPermission ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// CRUD de Usuario-Rol
const UserRolesCRUD: React.FC = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    user_id: '',
    role_id: '',
    startAt: '',
    endAt: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRolesRes, usersRes, rolesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/user-roles/`),
        fetch(`${API_BASE_URL}/users/`),
        fetch(`${API_BASE_URL}/roles/`),
      ]);
      
      const userRolesData = await userRolesRes.json();
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      
      console.log('UserRoles data:', userRolesData);
      console.log('Users data:', usersData);
      console.log('Roles data:', rolesData);
      
      setUserRoles(Array.isArray(userRolesData) ? userRolesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUserRoles([]);
      setUsers([]);
      setRoles([]);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/user-roles/user/${formData.user_id}/role/${formData.role_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startAt: formData.startAt,
          endAt: formData.endAt,
        }),
      });

      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving user-role:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      try {
        await fetch(`${API_BASE_URL}/user-roles/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting user-role:', error);
      }
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
  };

  const getUserName = (userId: number): string => users.find((u) => u.id === userId)?.name || 'N/A';
  const getRoleName = (roleId: number): string => roles.find((r) => r.id === roleId)?.name || 'N/A';

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Asignación Usuario-Rol</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Asignación
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {userRoles.map((userRole) => (
              <tr key={userRole.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{getUserName(userRole.user_id)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {getRoleName(userRole.role_id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(userRole.startAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {userRole.endAt ? new Date(userRole.endAt).toLocaleDateString() : 'Sin límite'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(userRole.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nueva Asignación Usuario-Rol" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select
                required
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                required
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
              <input
                type="datetime-local"
                required
                value={formData.startAt}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
              <input
                type="datetime-local"
                required
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// CRUD de Rol-Permiso
const RolePermissionsCRUD: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({ role_id: '', permission_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolePermissionsRes, rolesRes, permissionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/role-permissions/`),
        fetch(`${API_BASE_URL}/roles/`),
        fetch(`${API_BASE_URL}/permissions/`),
      ]);
      setRolePermissions(await rolePermissionsRes.json());
      setRoles(await rolesRes.json());
      setPermissions(await permissionsRes.json());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(
        `${API_BASE_URL}/role-permissions/role/${formData.role_id}/permission/${formData.permission_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      );

      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving role-permission:', error);
    }
  };

  const handleDelete = async (roleId: number, permissionId: number) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      try {
        await fetch(`${API_BASE_URL}/role-permissions/role/${roleId}/permission/${permissionId}`, {
          method: 'DELETE',
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting role-permission:', error);
      }
    }
  };

  const openModal = () => {
    setFormData({ role_id: '', permission_id: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ role_id: '', permission_id: '' });
  };

  const getRoleName = (roleId: number): string => roles.find((r) => r.id === roleId)?.name || 'N/A';
  const getPermissionInfo = (permissionId: number): string => {
    const perm = permissions.find((p) => p.id === permissionId);
    return perm ? `${perm.method} ${perm.url}` : 'N/A';
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Asignación Rol-Permiso</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Asignación
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permiso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rolePermissions.map((rp) => (
              <tr key={rp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {getRoleName(rp.role_id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{getPermissionInfo(rp.permission_id)}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(rp.role_id, rp.permission_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nueva Asignación Rol-Permiso" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                required
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Permiso</label>
              <select
                required
                value={formData.permission_id}
                onChange={(e) => setFormData({ ...formData, permission_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar permiso</option>
                {permissions.map((permission) => (
                  <option key={permission.id} value={permission.id}>
                    {permission.method} - {permission.url} ({permission.entity})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
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
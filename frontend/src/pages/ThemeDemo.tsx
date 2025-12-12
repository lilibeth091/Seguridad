import React, { useState } from 'react';
import { Button, Input, Table, Modal } from '../components/ui';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DemoUser {
  id: number;
  name: string;
  email: string;
}

const ThemeDemo: React.FC = () => {
  const { currentLibrary } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const demoUsers: DemoUser[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com' },
  ];

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'actions', header: 'Acciones' },
  ];

  const renderRow = (user: DemoUser) => {
    return (
      <>
        <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
        <td className="px-6 py-4 text-sm">
          <div className={currentLibrary === 'bootstrap' ? 'd-flex gap-2' : 'flex gap-2'}>
            <Button variant="primary" icon={<Eye className="w-4 h-4" />} size="small">
              Ver
            </Button>
            <Button variant="warning" icon={<Edit className="w-4 h-4" />} size="small">
              Editar
            </Button>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} size="small">
              Eliminar
            </Button>
          </div>
        </td>
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demo de Componentes - {currentLibrary === 'tailwind' ? 'TAILWIND CSS' : 'BOOTSTRAP'}
        </h1>
        <p className="text-gray-600">
          Componentes genéricos renderizados con la librería actual
        </p>
      </div>

      {/* Sección de Botones */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Botones</h2>
        <div className={currentLibrary === 'bootstrap' ? 'd-flex flex-wrap gap-3' : 'flex flex-wrap gap-3'}>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Primary
          </Button>
          <Button variant="secondary" icon={<Edit className="w-4 h-4" />}>
            Secondary
          </Button>
          <Button variant="success" icon={<Plus className="w-4 h-4" />}>
            Success
          </Button>
          <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>
            Danger
          </Button>
          <Button variant="warning" icon={<Eye className="w-4 h-4" />}>
            Warning
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Sección de Inputs */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Inputs</h2>
        <div className={currentLibrary === 'bootstrap' ? 'row' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
          <div className={currentLibrary === 'bootstrap' ? 'col-md-6' : ''}>
            <Input
              label="Nombre"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre"
              required
            />
          </div>
          <div className={currentLibrary === 'bootstrap' ? 'col-md-6' : ''}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className={currentLibrary === 'bootstrap' ? 'col-12' : 'md:col-span-2'}>
            <Input
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escriba una descripción..."
              multiline
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Sección de Tabla */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <div className={currentLibrary === 'bootstrap' ? 'd-flex justify-content-between align-items-center mb-4' : 'flex justify-between items-center mb-4'}>
          <h2 className="text-2xl font-bold text-gray-900">Tabla</h2>
          <Button
            variant="success"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowModal(true)}
          >
            Nuevo Usuario
          </Button>
        </div>
        <Table
          columns={columns}
          data={demoUsers}
          renderRow={renderRow}
          emptyMessage="No hay usuarios para mostrar"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Usuario"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Guardar
            </Button>
          </>
        }
      >
        <div className={currentLibrary === 'bootstrap' ? '' : 'space-y-4'}>
          <Input
            label="Nombre Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez"
            required
          />
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@ejemplo.com"
            required
          />
          <Input
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Información adicional..."
            multiline
            rows={3}
          />
        </div>
      </Modal>

      {/* Información de la librería actual */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className={currentLibrary === 'bootstrap' ? 'd-flex align-items-start gap-3' : 'flex items-start gap-3'}>
          <div className={currentLibrary === 'bootstrap' ? 'flex-shrink-0' : 'flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'}>
            <span className="text-white text-sm font-bold">ℹ</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-1">
              Librería Actual: {currentLibrary === 'tailwind' ? 'TAILWIND CSS' : 'BOOTSTRAP'}
            </h3>
            <p className="text-sm text-blue-800">
              {currentLibrary === 'tailwind'
                ? 'Usando Tailwind CSS con clases de utilidad, degradados y sombras de colores personalizadas.'
                : 'Usando Bootstrap 5 con componentes clásicos, bordes gruesos y estilo tradicional.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;

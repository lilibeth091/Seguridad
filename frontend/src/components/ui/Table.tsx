import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Table as BootstrapTable } from 'react-bootstrap';

interface Column {
  key: string;
  header: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  renderRow,
  emptyMessage = 'No hay datos disponibles',
}) => {
  const { currentLibrary } = useTheme();

  if (currentLibrary === 'bootstrap') {
    // Bootstrap - Striped table con bordes
    return (
      <div className="border rounded shadow">
        <BootstrapTable striped bordered hover responsive className="mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.className}
                  style={{
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #dee2e6'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-muted"
                  style={{ padding: '2rem' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>{renderRow(item, index)}</tr>
              ))
            )}
          </tbody>
        </BootstrapTable>
      </div>
    );
  }

  // Tailwind CSS - Diseño personalizado con degradados
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  {renderRow(item, index)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

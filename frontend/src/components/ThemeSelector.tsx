import React from 'react';
import { useTheme, ThemeLibrary } from '../contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentLibrary, setCurrentLibrary } = useTheme();

  const libraries: { value: ThemeLibrary; label: string; color: string }[] = [
    { value: 'tailwind', label: 'Tailwind CSS', color: '#06B6D4' },
    { value: 'bootstrap', label: 'Bootstrap', color: '#198754' }
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b-2 border-indigo-200 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <Palette className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-800">Librería de Diseño</h3>
              <p className="text-xs text-gray-600">
                Actual: <span className="font-bold">{libraries.find(l => l.value === currentLibrary)?.label}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {libraries.map((lib) => (
              <button
                key={lib.value}
                onClick={() => setCurrentLibrary(lib.value)}
                className={`
                  relative px-4 py-1.5 rounded-lg font-semibold text-xs
                  transition-all duration-200 shadow-md
                  ${currentLibrary === lib.value
                    ? 'text-white ring-2 ring-white ring-offset-1'
                    : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                  }
                `}
                style={{
                  backgroundColor: currentLibrary === lib.value ? lib.color : undefined,
                }}
              >
                {currentLibrary === lib.value && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                    <Check className="w-3 h-3" style={{ color: lib.color }} />
                  </div>
                )}
                {lib.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeLibrary = 'tailwind' | 'bootstrap';

interface ThemeContextType {
  currentLibrary: ThemeLibrary;
  setCurrentLibrary: (library: ThemeLibrary) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLibrary, setCurrentLibrary] = useState<ThemeLibrary>(() => {
    // Obtener el tema guardado en localStorage o usar 'tailwind' por defecto
    const savedLibrary = localStorage.getItem('themeLibrary') as ThemeLibrary;
    return savedLibrary || 'tailwind';
  });

  useEffect(() => {
    // Guardar el tema actual en localStorage
    localStorage.setItem('themeLibrary', currentLibrary);

    // Cargar/descargar Bootstrap CSS dinámicamente
    const bootstrapLink = document.getElementById('bootstrap-css');

    if (currentLibrary === 'bootstrap') {
      if (!bootstrapLink) {
        const link = document.createElement('link');
        link.id = 'bootstrap-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
      }
    } else {
      if (bootstrapLink) {
        bootstrapLink.remove();
      }
    }
  }, [currentLibrary]);

  return (
    <ThemeContext.Provider value={{ currentLibrary, setCurrentLibrary }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

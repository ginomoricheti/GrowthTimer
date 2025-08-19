import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import PomodoroPage from './pages/PomodoroPage';
import { ProjectsProvider } from '@/shared/context/ProjectsContext';
import { CategoriesProvider } from '@/shared/context/CategoriesContext';
import { TasksProvider } from '@/shared/context/TasksContext';
import { PomodorosProvider } from '@/shared/context/PomodorosContext';
import { ReportsProvider } from '@/shared/context/ReportsContext';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        try {
          const appWindow = getCurrentWindow();
          const isFullscreen = await appWindow.isFullscreen();
          await appWindow.setFullscreen(!isFullscreen);
        } catch (error) {
          console.error('Error al cambiar modo pantalla completa:', error);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
      <ProjectsProvider>
          <CategoriesProvider>
            <TasksProvider>
              <PomodorosProvider>
                <ReportsProvider>
                  <PomodoroPage />
                  <ToastContainer 
                    position="top-right" 
                    autoClose={3000} 
                    hideProgressBar={false} 
                    newestOnTop={false} 
                    closeOnClick 
                    rtl={false} 
                    pauseOnFocusLoss 
                    draggable 
                    pauseOnHover 
                    theme='colored'
                  />
                </ReportsProvider>
              </PomodorosProvider>
            </TasksProvider>
          </CategoriesProvider>
      </ProjectsProvider>
    </PrimeReactProvider>
  );
}

export default App

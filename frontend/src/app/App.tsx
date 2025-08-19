import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import PomodoroPage from './pages/PomodoroPage';
import { ProjectsProvider } from '@/shared/context/ProjectsContext';
import { CategoriesProvider } from '@/shared/context/CategoriesContext';
import { TasksProvider } from '@/shared/context/TasksContext';
import { PomodorosProvider } from '@/shared/context/PomodorosContext';
import { ReportsProvider } from '@/shared/context/ReportsContext';

function App() {

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
                  />
                </ReportsProvider>
              </PomodorosProvider>
            </TasksProvider>
          </CategoriesProvider>
      </ProjectsProvider>
    </PrimeReactProvider>
      )
}

export default App

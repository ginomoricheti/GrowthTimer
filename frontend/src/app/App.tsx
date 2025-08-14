import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import PomodoroPage from './pages/PomodoroPage';
import { GoalsProvider } from '@/shared/context/GoalsContext';
import { ProjectsProvider } from '@/shared/context/ProjectsContext';
import { CategoriesProvider } from '@/shared/context/CategoryContext';

function App() {

  return (
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
      <ProjectsProvider>
        <GoalsProvider>
          <CategoriesProvider>
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
          </CategoriesProvider>
        </GoalsProvider>
      </ProjectsProvider>
    </PrimeReactProvider>
  )
}

export default App

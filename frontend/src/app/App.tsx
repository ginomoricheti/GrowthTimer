import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import Navbar from '../shared/design-system/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router';
import PomodoroPage from '../features/pomodoro/PomodoroPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import HistoryPage from '../features/history/HistoryPage';

function App() {

  return (
    <BrowserRouter>
      <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
        <Navbar />
        <Routes>
          <Route path='/' element={<PomodoroPage />}></Route>
          <Route path='/projects' element={<ProjectsPage />}></Route>
          <Route path='/history' element={<HistoryPage />}></Route>
        </Routes>
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
      </PrimeReactProvider>
    </BrowserRouter>
  )
}

export default App

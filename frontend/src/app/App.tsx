import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import PomodoroPage from '../features/pomodoro/PomodoroPage';

function App() {

  return (
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
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
    </PrimeReactProvider>
  )
}

export default App

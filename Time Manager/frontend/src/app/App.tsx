import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import CountdownTimer from '../pomodoro/components/CountdownTimer/CountdownTimer'
import { ToastContainer } from 'react-toastify';
import Navbar from '../shared/design-system/Navbar/Navbar';

function App() {

  return (
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
      <Navbar />
      <CountdownTimer />
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

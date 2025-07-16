import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import CountdownTimer from '../pomodoro/components/CountdownTimer/CountdownTimer'

function App() {

  return (
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
      <CountdownTimer />
    </PrimeReactProvider>
  )
}

export default App

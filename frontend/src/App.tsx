import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import './App.css'
import SignUp from './views/sign-up';

export default function App() {
  

  return (

     <AuthProvider>
      <Router>
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/app" element={<App/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}



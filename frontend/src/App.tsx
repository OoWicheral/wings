import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import SignUp from './pages/Sign-up.tsx';
import SignOn from "./pages/Sign-on.tsx";


export default function App() {
  

  return (

     <AuthProvider>
      <Router>
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/login" element={<SignOn />} />
            <Route path="/app" element={<App/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}



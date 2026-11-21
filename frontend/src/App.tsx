import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import SignUp from './pages/Sign-up.tsx';
import SignOn from "./pages/Sign-on.tsx";
import Home from './pages/Home.tsx';
import ChatIA from './pages/Chat-ia.tsx';
import Profile from './pages/Profile.tsx';
import Community from './pages/Community.tsx';


export default function App() {
  

  return (

     <AuthProvider>
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/login" element={<SignOn />} />
            <Route path="/chat" element={<ChatIA />} />
            <Route path="/comunidade" element={<Community />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/app" element={<App/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
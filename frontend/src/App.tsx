import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import { AuthModalProvider, useAuthModal } from './hooks/use-auth-modal';
import type { AuthMode } from './hooks/use-auth-modal';
import AuthModal from './pages/AuthModal';
import Home from './pages/Home';
import ChatIA from './pages/Chat-ia';
import ChatProfessional from './pages/Chat-professional';
import Professionals from './pages/Professionals';
import Profile from './pages/Profile';
import Community from './pages/Community';

function AuthModalRoute({ mode }: { mode: AuthMode }) {
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    openAuthModal(mode);
    navigate('/', { replace: true });
  }, [mode, openAuthModal, navigate]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <Router>
          <AuthModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<AuthModalRoute mode="signup" />} />
            <Route path="/login" element={<AuthModalRoute mode="login" />} />
            <Route path="/chat" element={<ChatIA />} />
            <Route path="/chat-profissional" element={<ChatProfessional />} />
            <Route path="/chat-profissional/:chatId" element={<ChatProfessional />} />
            <Route path="/comunidade" element={<Community />} />
            <Route path="/profissionais" element={<Professionals />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthModalProvider>
    </AuthProvider>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import SignUp from './pages/Sign-up';
import SignOn from './pages/Sign-on';
import Home from './pages/Home';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cadastro" element={<SignUp />} />
                    <Route path="/login" element={<SignOn />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
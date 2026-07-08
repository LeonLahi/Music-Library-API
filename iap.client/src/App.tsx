import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PlaylistTracksPage from './pages/PlaylistTracksPage';
import LibraryPage from './pages/LibraryPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* 1. Public routes (Login / Register) */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
            />

            {/* 2. Protected pages (Authenticated Users Only) */}
            <Route
                element={
                    <ProtectedRoute>
                        {/* The structural frame wraps around all pages nested below */}
                        <AppLayout /> 
                    </ProtectedRoute>
                }
            >
                {/* Protected pages added here to be included in AppLayout */}
                <Route path="/" element={<HomePage />} />
                <Route path="/playlist/:playlistId" element={<PlaylistTracksPage />} />
                <Route path="/library" element={<LibraryPage />} />
            </Route>

            {/* Return user to home page if a url does not match any pages  */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TranslationProvider, useTranslation } from './hooks/useTranslation';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import MainScreen from './components/MainScreen';
import ProtectedRoute from './components/ProtectedRoute';
import LanguageSelector from './components/LanguageSelector';
import ThemeToggle from './components/ThemeToggle';

const AppRoutes: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#667eea'
            }}>
                {t('common.loading')}
            </div>
        );
    }

    return (
        <Routes>
            <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/main" replace /> : <LoginScreen />} 
            />
            <Route 
                path="/signup" 
                element={isAuthenticated ? <Navigate to="/main" replace /> : <SignupScreen />} 
            />
            <Route 
                path="/main" 
                element={
                    <ProtectedRoute>
                        <MainScreen />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/" 
                element={<Navigate to={isAuthenticated ? "/main" : "/login"} replace />} 
            />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <TranslationProvider>
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <div style={{
                            position: 'fixed',
                            bottom: '20px',
                            left: '20px',
                            zIndex: 1000,
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center'
                        }}>
                            <LanguageSelector />
                            <ThemeToggle />
                        </div>
                        <AppRoutes />
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </TranslationProvider>
    );
};

export default App;
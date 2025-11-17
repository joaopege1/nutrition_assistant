import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 480);
            setIsTablet(width > 480 && width <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login({ username, password });
            navigate('/main');
        } catch (error: any) {
            setError(error.response?.data?.detail || t('auth.loginError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-gradient)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: isMobile ? '8px' : isTablet ? '16px' : '24px',
            position: 'relative'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                padding: isMobile ? '20px' : isTablet ? '32px' : '40px',
                borderRadius: isMobile ? '8px' : '16px',
                boxShadow: `0 20px 40px var(--shadow)`,
                width: '100%',
                maxWidth: isMobile ? '100%' : isTablet ? '400px' : '450px',
                margin: '0',
                border: `1px solid var(--border-color)`,
                transition: 'all 0.3s ease'
            }}>
                <div style={{ marginBottom: isMobile ? '20px' : '24px' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            transition: 'color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--button-primary)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        ← {t('auth.backToHome')}
                    </Link>
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '30px' }}>
                    <h2 style={{
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? '24px' : isTablet ? '26px' : '28px',
                        fontWeight: '600',
                        margin: '0 0 8px 0'
                    }}>{t('auth.loginTitle')}</h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '14px' : '16px',
                        margin: '0'
                    }}>{t('auth.loginSubtitle')}</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>{t('auth.username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="username"
                            style={{
                                width: '100%',
                                padding: isMobile ? '10px 14px' : '12px 16px',
                                border: `2px solid var(--border-color)`,
                                borderRadius: isMobile ? '6px' : '8px',
                                fontSize: isMobile ? '16px' : '16px',
                                transition: 'border-color 0.3s ease',
                                boxSizing: 'border-box',
                                backgroundColor: 'var(--input-bg)',
                                color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--button-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: isMobile ? '24px' : '30px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: isMobile ? '10px 14px' : '12px 16px',
                                border: `2px solid var(--border-color)`,
                                borderRadius: isMobile ? '6px' : '8px',
                                fontSize: isMobile ? '16px' : '16px',
                                transition: 'border-color 0.3s ease',
                                boxSizing: 'border-box',
                                backgroundColor: 'var(--input-bg)',
                                color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--button-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: isMobile ? '12px' : '14px',
                            backgroundColor: isLoading ? 'var(--text-secondary)' : 'var(--button-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: isMobile ? '6px' : '8px',
                            fontSize: isMobile ? '16px' : '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s ease',
                            boxShadow: isLoading ? 'none' : `0 4px 12px var(--shadow)`,
                            minHeight: isMobile ? '48px' : 'auto'
                        }}
                        onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)')}
                        onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--button-primary)')}
                    >
                        {isLoading ? t('common.loading') : t('auth.login')}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: isMobile ? '24px' : '30px' }}>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: isMobile ? '13px' : '14px', 
                        margin: '0',
                        lineHeight: '1.4'
                    }}>
                        {t('auth.dontHaveAccount')} 
                        <Link 
                            to="/signup" 
                            style={{ 
                                color: 'var(--button-primary)', 
                                textDecoration: 'none',
                                fontWeight: '500',
                                marginLeft: '4px'
                            }}
                        >
                            {t('auth.signupHere')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

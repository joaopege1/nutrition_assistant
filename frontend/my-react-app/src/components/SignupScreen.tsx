import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const SignupScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signup } = useAuth();
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Senhas não coincidem!');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        setIsLoading(true);

        try {
            await signup({
                username,
                email,
                full_name: fullName,
                password,
                role
            });
            navigate('/login');
        } catch (error: any) {
            setError(error.response?.data?.detail || t('auth.signupError'));
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
            {/* Theme Toggle Button */}
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
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '30px' }}>
                    <h2 style={{
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? '24px' : isTablet ? '26px' : '28px',
                        fontWeight: '600',
                        margin: '0 0 8px 0'
                    }}>Criar conta</h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '14px' : '16px',
                        margin: '0'
                    }}>Preencha os dados para se cadastrar</p>
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

                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>Nome completo</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Seu nome completo"
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

                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="seu_usuario"
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

                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
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

                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>Tipo de usuário</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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
                        >
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>Senha</label>
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

                    <div style={{ marginBottom: isMobile ? '24px' : '30px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: '500',
                            marginBottom: '8px'
                        }}>Confirmar senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            backgroundColor: isLoading ? 'var(--text-secondary)' : 'var(--button-success)',
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
                        onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--button-success-hover)')}
                        onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--button-success)')}
                    >
                        {isLoading ? 'Criando conta...' : 'Cadastrar'}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: isMobile ? '24px' : '30px' }}>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: isMobile ? '13px' : '14px', 
                        margin: '0',
                        lineHeight: '1.4'
                    }}>
                        Já tem conta? 
                        <Link 
                            to="/login" 
                            style={{ 
                                color: 'var(--button-primary)', 
                                textDecoration: 'none',
                                fontWeight: '500',
                                marginLeft: '4px'
                            }}
                        >
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupScreen;

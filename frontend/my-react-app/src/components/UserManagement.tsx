import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { adminService } from '../services/adminService';
import type { User } from '../types';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        if (user?.role === 'admin') {
            loadUsers();
        }
    }, [user]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const usersData = await adminService.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            setError(t('admin.loadUsersError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        if (!confirm(t('admin.confirmRoleChange', { role: newRole }))) {
            return;
        }

        try {
            await adminService.updateUserRole(userId, newRole);
            loadUsers(); // Recarregar a lista
        } catch (error) {
            console.error('Erro ao atualizar role:', error);
            setError(t('admin.roleUpdateError'));
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: 'var(--text-primary)'
            }}>
                {t('admin.accessDenied')}
            </div>
        );
    }

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
                {t('admin.loadingUsers')}
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-gradient)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: 'var(--text-primary)',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(102, 126, 234, 0.1) 100%)',
                padding: isMobile ? '20px' : '32px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.1)`,
                borderBottom: `1px solid var(--border-color)`,
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, var(--button-primary) 0%, #667eea 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            color: 'white',
                            boxShadow: `0 4px 12px rgba(102, 126, 234, 0.3)`
                        }}>
                            👥
                        </div>
                        <h1 style={{
                            margin: '0',
                            color: 'var(--text-primary)',
                            fontSize: isMobile ? '24px' : '32px',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, var(--text-primary) 0%, #667eea 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {t('admin.userManagement')}
                        </h1>
                    </div>
                    <p style={{
                        margin: '0',
                        color: 'var(--text-secondary)',
                        fontSize: '16px',
                        fontWeight: '400',
                        opacity: 0.8
                    }}>
                        {t('admin.userManagementSubtitle')}
                    </p>
                </div>
                
                <button
                    onClick={() => navigate('/main')}
                    style={{
                        padding: isMobile ? '12px 20px' : '14px 24px',
                        background: 'linear-gradient(135deg, var(--button-secondary) 0%, rgba(102, 126, 234, 0.1) 100%)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: `0 4px 12px rgba(0,0,0,0.1)`
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 8px 20px rgba(0,0,0,0.15)`;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`;
                    }}
                >
                    <span style={{ fontSize: '16px' }}>←</span>
                    {t('admin.backToDashboard')}
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                padding: isMobile ? '16px' : '24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
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

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(102, 126, 234, 0.05) 100%)',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
                        textAlign: 'center',
                        border: `1px solid var(--border-color)`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '60px',
                            height: '60px',
                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>Total</h3>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                                {users.length}
                            </p>
                        </div>
                    </div>
                    
                    <div style={{
                        background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(40, 167, 69, 0.05) 100%)',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
                        textAlign: 'center',
                        border: `1px solid var(--border-color)`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '60px',
                            height: '60px',
                            background: 'radial-gradient(circle, rgba(40, 167, 69, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>Users</h3>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                                {users.filter(u => u.role === 'user').length}
                            </p>
                        </div>
                    </div>
                    
                    <div style={{
                        background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(220, 53, 69, 0.05) 100%)',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
                        textAlign: 'center',
                        border: `1px solid var(--border-color)`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '60px',
                            height: '60px',
                            background: 'radial-gradient(circle, rgba(220, 53, 69, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>♛</div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>Admin</h3>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: '#dc3545' }}>
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.1)`,
                    overflow: 'hidden',
                    border: `1px solid var(--border-color)`,
                    transition: 'all 0.3s ease',
                    position: 'relative'
                }}>
                    <div style={{
                        padding: '28px',
                        borderBottom: `1px solid var(--border-color)`,
                        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(102, 126, 234, 0.02) 100%)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, var(--button-primary) 0%, #667eea 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                color: 'white'
                            }}>
                                📋
                            </div>
                            <h2 style={{ margin: '0', color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600' }}>{t('admin.userList')}</h2>
                        </div>
                    </div>
                    
                    {users.length === 0 ? (
                        <div style={{
                            padding: '60px 40px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>👥</div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>{t('admin.noUsers')}</h3>
                            <p style={{ margin: '0', fontSize: '14px', opacity: 0.7 }}>{t('admin.noUsers')}</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{ 
                                        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(102, 126, 234, 0.02) 100%)',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10
                                    }}>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>ID</th>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{t('auth.fullName')}</th>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{t('auth.username')}</th>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>Email</th>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{t('auth.role')}</th>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{t('admin.active')}</th>
                                        <th style={{ 
                                            padding: '20px 16px', 
                                            textAlign: 'left', 
                                            borderBottom: `2px solid var(--border-color)`, 
                                            color: 'var(--text-primary)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{t('dashboard.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userItem, index) => (
                                        <tr 
                                            key={userItem.id} 
                                            style={{ 
                                                borderBottom: `1px solid var(--border-color)`,
                                                transition: 'all 0.3s ease',
                                                background: index % 2 === 0 ? 'transparent' : 'rgba(102, 126, 234, 0.02)'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(102, 126, 234, 0.02)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <td style={{ 
                                                padding: '20px 16px', 
                                                color: 'var(--text-primary)',
                                                fontWeight: '500',
                                                fontSize: '14px'
                                            }}>{userItem.id}</td>
                                            <td style={{ 
                                                padding: '20px 16px', 
                                                color: 'var(--text-primary)',
                                                fontWeight: '500',
                                                fontSize: '14px'
                                            }}>{userItem.full_name || 'N/A'}</td>
                                            <td style={{ 
                                                padding: '20px 16px', 
                                                color: 'var(--text-primary)',
                                                fontWeight: '600',
                                                fontSize: '14px'
                                            }}>{userItem.username}</td>
                                            <td style={{ 
                                                padding: '20px 16px', 
                                                color: 'var(--text-primary)',
                                                fontWeight: '500',
                                                fontSize: '14px'
                                            }}>{userItem.email}</td>
                                            <td style={{ padding: '20px 16px' }}>
                                                <span style={{
                                                    padding: '8px 16px',
                                                    background: userItem.role === 'admin' 
                                                        ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' 
                                                        : 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                                                    color: 'white',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    boxShadow: userItem.role === 'admin' 
                                                        ? '0 4px 12px rgba(220, 53, 69, 0.3)' 
                                                        : '0 4px 12px rgba(40, 167, 69, 0.3)',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {userItem.role === 'admin' ? t('admin.administrator') : t('admin.user')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 16px' }}>
                                                <span style={{
                                                    padding: '8px 16px',
                                                    background: userItem.is_active 
                                                        ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' 
                                                        : 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                                                    color: 'white',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    boxShadow: userItem.is_active 
                                                        ? '0 4px 12px rgba(40, 167, 69, 0.3)' 
                                                        : '0 4px 12px rgba(108, 117, 125, 0.3)',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {userItem.is_active ? t('admin.active') : t('admin.inactive')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <select
                                                        value={userItem.role}
                                                        onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                                                        style={{
                                                            padding: '10px 16px',
                                                            border: `2px solid var(--border-color)`,
                                                            borderRadius: '12px',
                                                            fontSize: '13px',
                                                            fontWeight: '500',
                                                            backgroundColor: 'var(--input-bg)',
                                                            color: 'var(--text-primary)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                            minWidth: '120px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'var(--button-primary)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'var(--border-color)';
                                                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                                        }}
                                                    >
                                                        <option value="user">{t('admin.user')}</option>
                                                        <option value="admin">{t('admin.administrator')}</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

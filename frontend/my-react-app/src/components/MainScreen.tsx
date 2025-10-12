import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { foodService } from '../services/foodService';
import { adminService } from '../services/adminService';
import type { FoodEntry, FoodEntryCreate } from '../types';
import FoodEntryForm from './FoodEntryForm';

const MainScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

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
        loadFoodEntries();
    }, []);

    const loadFoodEntries = async () => {
        try {
            setIsLoading(true);
            const entries = user?.role === 'admin' 
                ? await adminService.getAllFoodEntries()
                : await foodService.getFoodEntries();
            setFoodEntries(entries);
        } catch (error) {
            console.error('Erro ao carregar entradas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateEntry = async (data: FoodEntryCreate) => {
        try {
            await foodService.createFoodEntry(data);
            setShowForm(false);
            loadFoodEntries();
        } catch (error) {
            console.error('Erro ao criar entrada:', error);
        }
    };

    const handleUpdateEntry = async (data: FoodEntryCreate) => {
        if (!editingEntry) return;
        
        try {
            await foodService.updateFoodEntry(editingEntry.id, data);
            setEditingEntry(null);
            loadFoodEntries();
        } catch (error) {
            console.error('Erro ao atualizar entrada:', error);
        }
    };

    const handleDeleteEntry = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta entrada?')) return;
        
        try {
            if (user?.role === 'admin') {
                await adminService.deleteFoodEntry(id);
            } else {
                await foodService.deleteFoodEntry(id);
            }
            loadFoodEntries();
        } catch (error) {
            console.error('Erro ao deletar entrada:', error);
        }
    };

    const handleToggleSafety = async (id: number, isSafe: boolean) => {
        if (user?.role !== 'admin') return;
        
        try {
            await adminService.updateFoodEntrySafety(id, isSafe);
            loadFoodEntries();
        } catch (error) {
            console.error('Erro ao atualizar segurança:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                Carregando...
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
                background: 'var(--card-bg)',
                padding: isMobile ? '16px' : '24px',
                boxShadow: `0 2px 10px var(--shadow)`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: `1px solid var(--border-color)`,
                transition: 'all 0.3s ease'
            }}>
                <div>
                    <h1 style={{
                        margin: '0',
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? '24px' : '28px',
                        fontWeight: '600'
                    }}>
                        Dashboard
                    </h1>
                    <p style={{
                        margin: '4px 0 0 0',
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                    }}>
                        {t('dashboard.welcomeMessage', { name: user?.full_name || user?.username })}
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                padding: isMobile ? '10px 16px' : '12px 20px',
                                backgroundColor: 'var(--button-success)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--button-success-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--button-success)'}
                        >
                            + {t('dashboard.addEntry')}
                        </button>
                    )}
                    
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: isMobile ? '10px 16px' : '12px 20px',
                            backgroundColor: 'var(--button-danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--button-danger-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--button-danger)'}
                    >
                        {t('auth.logout')}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                padding: isMobile ? '16px' : '24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {showForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <FoodEntryForm
                            onSubmit={handleCreateEntry}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {editingEntry && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <FoodEntryForm
                            onSubmit={handleUpdateEntry}
                            onCancel={() => setEditingEntry(null)}
                            initialData={editingEntry}
                            isEditing={true}
                        />
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
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: `0 4px 12px var(--shadow)`,
                        textAlign: 'center',
                        border: `1px solid var(--border-color)`,
                        transition: 'all 0.3s ease'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{t('dashboard.totalEntries')}</h3>
                        <p style={{ margin: '0', fontSize: '32px', fontWeight: '600', color: '#667eea' }}>
                            {foodEntries.length}
                        </p>
                    </div>
                    
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: `0 4px 12px var(--shadow)`,
                        textAlign: 'center',
                        border: `1px solid var(--border-color)`,
                        transition: 'all 0.3s ease'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{t('dashboard.safeEntries')}</h3>
                        <p style={{ margin: '0', fontSize: '32px', fontWeight: '600', color: '#28a745' }}>
                            {foodEntries.filter(entry => entry.is_safe).length}
                        </p>
                    </div>
                    
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: `0 4px 12px var(--shadow)`,
                        textAlign: 'center',
                        border: `1px solid var(--border-color)`,
                        transition: 'all 0.3s ease'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{t('dashboard.unsafeEntries')}</h3>
                        <p style={{ margin: '0', fontSize: '32px', fontWeight: '600', color: '#dc3545' }}>
                            {foodEntries.filter(entry => !entry.is_safe).length}
                        </p>
                    </div>
                </div>

                {/* Food Entries List */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px var(--shadow)`,
                    overflow: 'hidden',
                    border: `1px solid var(--border-color)`,
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        padding: '24px',
                        borderBottom: `1px solid var(--border-color)`,
                        background: 'var(--bg-secondary)'
                    }}>
                        <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>{t('dashboard.foodEntries')}</h2>
                    </div>
                    
                    {foodEntries.length === 0 ? (
                        <div style={{
                            padding: '40px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <p>{t('dashboard.noEntries')}</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-secondary)' }}>
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.user')}</th>
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.food')}</th>
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.quantity')}</th>
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.date')}</th>
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.safe')}</th>
                                        {user?.role === 'admin' && (
                                            <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.actions')}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodEntries.map((entry) => (
                                        <tr key={entry.id} style={{ borderBottom: `1px solid var(--border-color)` }}>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{entry.user}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{entry.food}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{entry.quantity}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                                                {entry.date ? 
                                                    (() => {
                                                        const date = new Date(entry.date);
                                                        return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
                                                    })() 
                                                    : 'Sem data'
                                                }
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                {user?.role === 'admin' ? (
                                                    <button
                                                        onClick={() => handleToggleSafety(entry.id, !entry.is_safe)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: entry.is_safe ? 'var(--button-success)' : 'var(--button-danger)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.3s ease'
                                                        }}
                                                    >
                                                        {entry.is_safe ? t('dashboard.safe') : t('dashboard.unsafe')}
                                                    </button>
                                                ) : (
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: entry.is_safe ? 'var(--success-bg)' : 'var(--error-bg)',
                                                        color: entry.is_safe ? 'var(--success-text)' : 'var(--error-text)',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}>
                                                        {entry.is_safe ? t('dashboard.safe') : t('dashboard.unsafe')}
                                                    </span>
                                                )}
                                            </td>
                                            {user?.role === 'admin' && (
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => setEditingEntry(entry)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: '#007bff',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.3s ease'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                                                        >
                                                            {t('common.edit')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEntry(entry.id)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: 'var(--button-danger)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.3s ease'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--button-danger-hover)'}
                                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--button-danger)'}
                                                        >
                                                            {t('common.delete')}
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
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

export default MainScreen;

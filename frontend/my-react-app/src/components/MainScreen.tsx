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
    const [filteredEntries, setFilteredEntries] = useState<FoodEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'unsafe'>('all');

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

    useEffect(() => {
        applyFilter();
    }, [foodEntries, activeFilter]);

    const applyFilter = () => {
        let filtered = [...foodEntries];
        
        switch (activeFilter) {
            case 'safe':
                filtered = foodEntries.filter(entry => entry.is_safe);
                break;
            case 'unsafe':
                filtered = foodEntries.filter(entry => !entry.is_safe);
                break;
            case 'all':
            default:
                filtered = foodEntries;
                break;
        }
        
        setFilteredEntries(filtered);
    };

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
        if (!confirm(t('common.confirm'))) return;
        
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
                {t('common.loading')}
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                borderBottom: `1px solid var(--border-color)`,
                transition: 'all 0.3s ease',
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
                            🍽️
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
                            {t('dashboard.title')}
                        </h1>
                    </div>
                    <p style={{
                        margin: '0',
                        color: 'var(--text-secondary)',
                        fontSize: '16px',
                        fontWeight: '400',
                        opacity: 0.8
                    }}>
                        {t('dashboard.welcomeMessage', { name: user?.full_name || user?.username })}
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: isMobile ? '12px 20px' : '14px 24px',
                            background: 'linear-gradient(135deg, var(--button-success) 0%, #28a745 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: `0 4px 12px rgba(40, 167, 69, 0.3)`
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 8px 20px rgba(40, 167, 69, 0.4)`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 4px 12px rgba(40, 167, 69, 0.3)`;
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>+</span>
                        {t('dashboard.addEntry')}
                    </button>
                    
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => navigate('/admin/users')}
                            style={{
                                padding: isMobile ? '12px 20px' : '14px 24px',
                                background: 'linear-gradient(135deg, var(--button-primary) 0%, #667eea 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: `0 4px 12px rgba(102, 126, 234, 0.3)`
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = `0 8px 20px rgba(102, 126, 234, 0.4)`;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 4px 12px rgba(102, 126, 234, 0.3)`;
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>👥</span>
                            {t('admin.userManagement')}
                        </button>
                    )}
                    
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: isMobile ? '12px 20px' : '14px 24px',
                            background: 'linear-gradient(135deg, var(--button-danger) 0%, #dc3545 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: `0 4px 12px rgba(220, 53, 69, 0.3)`
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 8px 20px rgba(220, 53, 69, 0.4)`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 4px 12px rgba(220, 53, 69, 0.3)`;
                        }}
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

                {/* Filter Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    <div 
                        onClick={() => setActiveFilter('all')}
                        style={{
                            background: activeFilter === 'all' 
                                ? 'linear-gradient(135deg, var(--button-primary) 0%, #667eea 100%)'
                                : 'linear-gradient(135deg, var(--card-bg) 0%, rgba(102, 126, 234, 0.05) 100%)',
                            padding: '28px',
                            borderRadius: '16px',
                            boxShadow: activeFilter === 'all' 
                                ? `0 12px 32px rgba(102, 126, 234, 0.3)`
                                : `0 8px 24px rgba(0,0,0,0.1)`,
                            textAlign: 'center',
                            border: activeFilter === 'all' 
                                ? `2px solid var(--button-primary)`
                                : `1px solid var(--border-color)`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transform: activeFilter === 'all' ? 'translateY(-4px)' : 'translateY(0)'
                        }}
                        onMouseOver={(e) => {
                            if (activeFilter !== 'all') {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 12px 32px rgba(102, 126, 234, 0.2)`;
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeFilter !== 'all') {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`;
                            }
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '80px',
                            height: '80px',
                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
                            <h3 style={{ 
                                margin: '0 0 12px 0', 
                                color: activeFilter === 'all' ? 'white' : 'var(--text-primary)', 
                                fontSize: '16px', 
                                fontWeight: '600' 
                            }}>
                                {t('dashboard.totalEntries')}
                            </h3>
                            <p style={{ 
                                margin: '0', 
                                fontSize: '36px', 
                                fontWeight: '700', 
                                color: activeFilter === 'all' ? 'white' : '#667eea' 
                            }}>
                                {foodEntries.length}
                            </p>
                        </div>
                    </div>
                    
                    <div 
                        onClick={() => setActiveFilter('safe')}
                        style={{
                            background: activeFilter === 'safe' 
                                ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)'
                                : 'linear-gradient(135deg, var(--card-bg) 0%, rgba(40, 167, 69, 0.05) 100%)',
                            padding: '28px',
                            borderRadius: '16px',
                            boxShadow: activeFilter === 'safe' 
                                ? `0 12px 32px rgba(40, 167, 69, 0.3)`
                                : `0 8px 24px rgba(0,0,0,0.1)`,
                            textAlign: 'center',
                            border: activeFilter === 'safe' 
                                ? `2px solid #28a745`
                                : `1px solid var(--border-color)`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transform: activeFilter === 'safe' ? 'translateY(-4px)' : 'translateY(0)'
                        }}
                        onMouseOver={(e) => {
                            if (activeFilter !== 'safe') {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 12px 32px rgba(40, 167, 69, 0.2)`;
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeFilter !== 'safe') {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`;
                            }
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '80px',
                            height: '80px',
                            background: 'radial-gradient(circle, rgba(40, 167, 69, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                            <h3 style={{ 
                                margin: '0 0 12px 0', 
                                color: activeFilter === 'safe' ? 'white' : 'var(--text-primary)', 
                                fontSize: '16px', 
                                fontWeight: '600' 
                            }}>
                                {t('dashboard.safeEntries')}
                            </h3>
                            <p style={{ 
                                margin: '0', 
                                fontSize: '36px', 
                                fontWeight: '700', 
                                color: activeFilter === 'safe' ? 'white' : '#28a745' 
                            }}>
                                {foodEntries.filter(entry => entry.is_safe).length}
                            </p>
                        </div>
                    </div>
                    
                    <div 
                        onClick={() => setActiveFilter('unsafe')}
                        style={{
                            background: activeFilter === 'unsafe' 
                                ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                                : 'linear-gradient(135deg, var(--card-bg) 0%, rgba(220, 53, 69, 0.05) 100%)',
                            padding: '28px',
                            borderRadius: '16px',
                            boxShadow: activeFilter === 'unsafe' 
                                ? `0 12px 32px rgba(220, 53, 69, 0.3)`
                                : `0 8px 24px rgba(0,0,0,0.1)`,
                            textAlign: 'center',
                            border: activeFilter === 'unsafe' 
                                ? `2px solid #dc3545`
                                : `1px solid var(--border-color)`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transform: activeFilter === 'unsafe' ? 'translateY(-4px)' : 'translateY(0)'
                        }}
                        onMouseOver={(e) => {
                            if (activeFilter !== 'unsafe') {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 12px 32px rgba(220, 53, 69, 0.2)`;
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeFilter !== 'unsafe') {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`;
                            }
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '80px',
                            height: '80px',
                            background: 'radial-gradient(circle, rgba(220, 53, 69, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
                            <h3 style={{ 
                                margin: '0 0 12px 0', 
                                color: activeFilter === 'unsafe' ? 'white' : 'var(--text-primary)', 
                                fontSize: '16px', 
                                fontWeight: '600' 
                            }}>
                                {t('dashboard.unsafeEntries')}
                            </h3>
                            <p style={{ 
                                margin: '0', 
                                fontSize: '36px', 
                                fontWeight: '700', 
                                color: activeFilter === 'unsafe' ? 'white' : '#dc3545' 
                            }}>
                                {foodEntries.filter(entry => !entry.is_safe).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Food Entries List */}
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
                                🍽️
                            </div>
                            <h2 style={{ margin: '0', color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600' }}>{t('dashboard.foodEntries')}</h2>
                        </div>
                    </div>
                    
                    {filteredEntries.length === 0 ? (
                        <div style={{
                            padding: '60px 40px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🍽️</div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>{t('dashboard.noEntries')}</h3>
                            <p style={{ margin: '0', fontSize: '14px', opacity: 0.7 }}>{t('dashboard.noEntries')}</p>
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
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: `1px solid var(--border-color)`, color: 'var(--text-primary)' }}>{t('dashboard.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEntries.map((entry) => (
                                        <tr key={entry.id} style={{ borderBottom: `1px solid var(--border-color)` }}>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{entry.user}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{entry.food}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{entry.quantity}</td>
                                            <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                                                {entry.date ? 
                                                    (() => {
                                                        const date = new Date(entry.date);
                                                        return isNaN(date.getTime()) ? t('dashboard.invalidDate') : date.toLocaleDateString('pt-BR');
                                                    })() 
                                                    : t('dashboard.noDate')
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
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {/* Mostrar botões de editar/deletar se for admin ou se for o dono da entrada */}
                                                    {(user?.role === 'admin' || entry.user === user?.username) && (
                                                        <>
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
                                                        </>
                                                    )}
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

export default MainScreen;

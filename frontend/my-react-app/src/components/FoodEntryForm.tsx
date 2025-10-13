import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import type { FoodEntryCreate } from '../types';

interface FoodEntryFormProps {
    onSubmit: (data: FoodEntryCreate) => void;
    onCancel: () => void;
    initialData?: Partial<FoodEntryCreate>;
    isEditing?: boolean;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FoodEntryCreate>({
        user: '', // Será preenchido automaticamente pelo backend
        food: initialData?.food || '',
        quantity: initialData?.quantity || 1,
        is_safe: initialData?.is_safe || false,
        date: initialData?.date || new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%'
        }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                {isEditing ? t('forms.foodEntry.update') : t('forms.foodEntry.create')}
            </h3>
            
            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px'
                    }}>{t('forms.foodEntry.food')}</label>
                    <input
                        type="text"
                        value={formData.food}
                        onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                        required
                        placeholder="Nome da comida"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px'
                    }}>{t('forms.foodEntry.quantity')}</label>
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                        required
                        min="1"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px'
                    }}>{t('forms.foodEntry.date')}</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={formData.is_safe}
                            onChange={(e) => setFormData({ ...formData, is_safe: e.target.checked })}
                            style={{
                                marginRight: '8px',
                                transform: 'scale(1.2)'
                            }}
                        />
                        {t('forms.foodEntry.isSafe')}
                    </label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6fd8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                    >
                        {isEditing ? t('forms.foodEntry.update') : t('forms.foodEntry.create')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                    >
                        {t('common.cancel')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FoodEntryForm;

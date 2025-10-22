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
                        placeholder={t('forms.foodEntry.foodPlaceholder')}
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
                        display: 'block',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px'
                    }}>
                        {t('forms.foodEntry.isSafe')}
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_safe: true })}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                backgroundColor: formData.is_safe ? '#28a745' : '#e1e5e9',
                                color: formData.is_safe ? 'white' : '#6c757d',
                                border: formData.is_safe ? '2px solid #28a745' : '2px solid #e1e5e9',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: formData.is_safe ? '0 4px 12px rgba(40, 167, 69, 0.3)' : 'none'
                            }}
                            onMouseOver={(e) => {
                                if (!formData.is_safe) {
                                    e.currentTarget.style.backgroundColor = '#d1d5d9';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!formData.is_safe) {
                                    e.currentTarget.style.backgroundColor = '#e1e5e9';
                                }
                            }}
                        >
                            ✓ {t('forms.foodEntry.safe')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_safe: false })}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                backgroundColor: !formData.is_safe ? '#dc3545' : '#e1e5e9',
                                color: !formData.is_safe ? 'white' : '#6c757d',
                                border: !formData.is_safe ? '2px solid #dc3545' : '2px solid #e1e5e9',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: !formData.is_safe ? '0 4px 12px rgba(220, 53, 69, 0.3)' : 'none'
                            }}
                            onMouseOver={(e) => {
                                if (formData.is_safe) {
                                    e.currentTarget.style.backgroundColor = '#d1d5d9';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (formData.is_safe) {
                                    e.currentTarget.style.backgroundColor = '#e1e5e9';
                                }
                            }}
                        >
                            ✗ {t('forms.foodEntry.unsafe')}
                        </button>
                    </div>
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

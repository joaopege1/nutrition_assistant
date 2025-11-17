import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Dashboard: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // Debug: Test translation
    console.log('Test translation:', t('landing.appName'));
    console.log('Test auth:', t('auth.login'));

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

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-gradient)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: isMobile ? '20px 8px' : isTablet ? '40px 16px' : '60px 24px',
            position: 'relative'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                padding: isMobile ? '24px' : isTablet ? '36px' : '48px',
                borderRadius: isMobile ? '12px' : '20px',
                boxShadow: `0 20px 60px var(--shadow)`,
                width: '100%',
                maxWidth: isMobile ? '100%' : isTablet ? '680px' : '900px',
                border: `1px solid var(--border-color)`,
                transition: 'all 0.3s ease'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '40px' }}>
                    <h1 style={{
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? '32px' : isTablet ? '38px' : '44px',
                        fontWeight: '700',
                        margin: '0 0 12px 0',
                        background: 'linear-gradient(135deg, var(--button-primary) 0%, var(--button-primary-hover) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {t('landing.appName')}
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
                        margin: '0',
                        fontWeight: '500'
                    }}>
                        {t('landing.appTagline')}
                    </p>
                </div>

                {/* About the App Section */}
                <div style={{
                    marginBottom: isMobile ? '32px' : '40px',
                    padding: isMobile ? '20px' : isTablet ? '24px' : '28px',
                    background: 'var(--input-bg)',
                    borderRadius: isMobile ? '10px' : '12px',
                    border: `1px solid var(--border-color)`
                }}>
                    <h2 style={{
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? '22px' : isTablet ? '24px' : '26px',
                        fontWeight: '600',
                        margin: '0 0 16px 0'
                    }}>
                        {t('landing.aboutTitle')}
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: '1.6',
                        margin: '0 0 12px 0'
                    }}>
                        {t('landing.aboutDescription1')}
                    </p>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: '1.6',
                        margin: '0'
                    }}>
                        {t('landing.aboutDescription2')}
                    </p>
                </div>

                {/* Intestinal Diseases Information */}
                <div style={{
                    marginBottom: isMobile ? '32px' : '40px',
                    padding: isMobile ? '20px' : isTablet ? '24px' : '28px',
                    background: 'var(--input-bg)',
                    borderRadius: isMobile ? '10px' : '12px',
                    border: `1px solid var(--border-color)`
                }}>
                    <h2 style={{
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? '22px' : isTablet ? '24px' : '26px',
                        fontWeight: '600',
                        margin: '0 0 16px 0'
                    }}>
                        {t('landing.diseasesTitle')}
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: '1.6',
                        margin: '0 0 16px 0'
                    }}>
                        {t('landing.diseasesIntro')}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: isMobile ? '16px' : '20px',
                        marginTop: '20px'
                    }}>
                        {/* Card 1 */}
                        <div style={{
                            padding: isMobile ? '16px' : '20px',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            border: `1px solid var(--border-color)`
                        }}>
                            <h3 style={{
                                color: 'var(--button-primary)',
                                fontSize: isMobile ? '16px' : '18px',
                                fontWeight: '600',
                                margin: '0 0 8px 0'
                            }}>
                                {t('landing.ibd')}
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: isMobile ? '13px' : '14px',
                                lineHeight: '1.5',
                                margin: '0'
                            }}>
                                {t('landing.ibdDescription')}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div style={{
                            padding: isMobile ? '16px' : '20px',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            border: `1px solid var(--border-color)`
                        }}>
                            <h3 style={{
                                color: 'var(--button-primary)',
                                fontSize: isMobile ? '16px' : '18px',
                                fontWeight: '600',
                                margin: '0 0 8px 0'
                            }}>
                                {t('landing.ibs')}
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: isMobile ? '13px' : '14px',
                                lineHeight: '1.5',
                                margin: '0'
                            }}>
                                {t('landing.ibsDescription')}
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div style={{
                            padding: isMobile ? '16px' : '20px',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            border: `1px solid var(--border-color)`
                        }}>
                            <h3 style={{
                                color: 'var(--button-primary)',
                                fontSize: isMobile ? '16px' : '18px',
                                fontWeight: '600',
                                margin: '0 0 8px 0'
                            }}>
                                {t('landing.celiac')}
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: isMobile ? '13px' : '14px',
                                lineHeight: '1.5',
                                margin: '0'
                            }}>
                                {t('landing.celiacDescription')}
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div style={{
                            padding: isMobile ? '16px' : '20px',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            border: `1px solid var(--border-color)`
                        }}>
                            <h3 style={{
                                color: 'var(--button-primary)',
                                fontSize: isMobile ? '16px' : '18px',
                                fontWeight: '600',
                                margin: '0 0 8px 0'
                            }}>
                                {t('landing.foodIntolerance')}
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: isMobile ? '13px' : '14px',
                                lineHeight: '1.5',
                                margin: '0'
                            }}>
                                {t('landing.foodIntoleranceDescription')}
                            </p>
                        </div>
                    </div>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: '1.6',
                        margin: '20px 0 0 0',
                        fontStyle: 'italic'
                    }}>
                        {t('landing.diseasesConclusion')}
                    </p>
                </div>

                {/* Call to Action */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isMobile ? '16px' : '20px'
                }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            maxWidth: isMobile ? '100%' : '400px',
                            padding: isMobile ? '14px 24px' : '16px 32px',
                            backgroundColor: 'var(--button-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: isMobile ? '8px' : '10px',
                            fontSize: isMobile ? '16px' : '18px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 4px 16px var(--shadow)`,
                            minHeight: isMobile ? '52px' : 'auto'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 8px 24px var(--shadow)`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--button-primary)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 4px 16px var(--shadow)`;
                        }}
                    >
                        {t('landing.getStarted')}
                    </button>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: isMobile ? '13px' : '14px',
                        margin: '0',
                        textAlign: 'center'
                    }}>
                        {t('landing.signupPrompt')}{' '}
                        <span
                            onClick={() => navigate('/signup')}
                            style={{
                                color: 'var(--button-primary)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {t('landing.signupLink')}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


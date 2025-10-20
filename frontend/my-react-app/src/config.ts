/**
 * Application configuration
 * Uses environment variables from Vite (import.meta.env)
 */

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
} as const;

export default config;


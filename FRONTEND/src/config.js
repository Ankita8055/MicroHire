/**
 * API Configuration
 * 
 * This file exports the base API URL from environment variables.
 * The VITE_API_URL should be defined in .env files:
 * - .env.development (for local development)
 * - .env.production (for production builds)
 */

export const API = import.meta.env.VITE_API_URL;

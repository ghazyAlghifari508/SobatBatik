import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url?: string) {
  if (!url) return 'https://placehold.co/400x400/e2e8f0/1e293b?text=No+Image';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Use VITE_API_URL or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
  // Remove /api/v1 from the end to get the base URL
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
  
  // Ensure the url starts with a slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
}

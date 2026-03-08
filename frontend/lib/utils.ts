import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API URL from environment variable or default to localhost
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "access_token";

/** Get Authorization header for authenticated API requests. Use in (admin) pages only. */
export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem("admin"); // legacy
}

// Format date string from backend (stored as UTC) to localized string
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  
  const dateStrFormatted = String(dateStr);
  let date: Date;
  
  // Check for timezone information (Z, +HH:MM, -HH:MM format)
  const hasTimezone = dateStrFormatted.includes('Z') || 
                     /[+-]\d{2}:\d{2}$/.test(dateStrFormatted) ||
                     /[+-]\d{4}$/.test(dateStrFormatted);
  
  if (hasTimezone) {
    // Timezone information already exists
    date = new Date(dateStrFormatted);
  } else {
    // If no timezone info, assume UTC (backend stores as UTC)
    // Add 'Z' for ISO format
    if (dateStrFormatted.includes('T')) {
      date = new Date(dateStrFormatted + 'Z');
    } else {
      // Handle date-only format as UTC
      date = new Date(dateStrFormatted + 'T00:00:00Z');
    }
  }
  
  // Validate date
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateStrFormatted);
    return dateStrFormatted;
  }
  
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

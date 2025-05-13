import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class Storage {
  static async set(key: string, value: string): Promise<void> {
    try {
      setCookie(key, String(value));
    } catch (err) {
      console.error("Error setting cookie:", err);
    }
  }

  static get(key: string): string | undefined {
    try {
      return getCookie(key) as string | undefined;
    } catch (err) {
      return undefined;
    }
  }

  static setObject<T>(key: string, value: T): void {
    try {
      setCookie(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error setting object:", err);
    }
  }

  static getObject<T>(key: string): T | undefined {
    try {
      const state = getCookie(key);
      return state ? JSON.parse(state as string) : undefined;
    } catch (err) {
      return undefined;
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (err) {
      console.error("Error clearing storage:", err);
    }
  }

  static clearAllCookies(): void {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      deleteCookie(cookieName);
    });
  }

  static remove(key: string): void {
    try {
      deleteCookie(key);
    } catch (err) {
      console.error("Error removing key:", err);
    }
  }
}

export const showSuccessAlert = (message: string) => {
  toast.success(message, {
    position: "top-right",
  });
};

export const showErrorAlert = (message: string) => {
  toast.error(message, {
    position: "bottom-right",
  });
};

export function formatNumber(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatString(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength) + "...";
}

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function formatDate(
  date: string | Date = "2025-03-28T11:21:31.410Z",
  locale: string = "en-US"
): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(
  date: string | Date = "2025-03-28T11:21:31.410Z",
  locale: string = "en-US"
): string {
  return new Date(date).toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatMoney(amount: number, currency: string = "NGN"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}


export function getAdminIdFromToken(): string | null {
  const token = Storage.get("token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.adminId || payload.sub; // Adjust based on your JWT structure
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Valida formato de e-mail (exige domínio com TLD de 2+ letras). */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sanitizeData = (data) => {
  if (data === null) return "";
  if (data instanceof Date) return data;
  if (Array.isArray(data)) return data.map(sanitizeData);
  if (typeof data === "number" && data !== null) return data.toString();
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeData(value)]),
    );
  }
  return data;
};

export const extractInitials = (fullName) => {
  let regex = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
  let initials = [...fullName.matchAll(regex)] || [];

  initials = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase();
  return initials;
};

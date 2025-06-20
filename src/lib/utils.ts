import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a user avatar URL.
 * If the user has a custom avatar, it returns that URL.
 * Otherwise, it generates a placeholder from ui-avatars.com with their initials.
 * @param name - The full name of the user.
 * @param avatarUrl - The user's custom avatar URL (optional).
 * @returns A full URL to the user's avatar image.
 */
export function getUserAvatar(
  name?: string,
  avatarUrl?: string | null
): string {
  if (avatarUrl) {
    return avatarUrl;
  }
  if (!name || name.trim() === "") {
    return "/default-avatar.png";
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  // Customize colors and size as needed
  const backgroundColor = "EBF4FF"; // A light blue background
  const textColor = "4F46E5"; // Indigo text color

  return `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor}&color=${textColor}&size=128`;
}

/**
 * Takes a raw Cloudinary URL and returns a new URL with
 * performance-optimizing transformations applied.
 * @param originalUrl The original image URL from your database.
 * @param width The target display width of the image in pixels.
 * @returns A new, optimized image URL.
 */
export function getOptimizedCloudinaryUrl(
  originalUrl: string,
  width: number
): string {
  if (!originalUrl || !originalUrl.includes("res.cloudinary.com")) {
    return originalUrl; // Return original if it's not a Cloudinary URL
  }
  const transformations = `f_auto,q_auto,w_${width},dpr_auto`;
  return originalUrl.replace("/upload/", `/upload/${transformations}/`);
}

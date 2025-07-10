import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status badge color utility function
export function getStatusBadgeStyles(status: string): string {
  const statusLower = status.toLowerCase();
  
  // Check for quiz not completed status specifically
  if (statusLower === 'not completed') {
    return "bg-muted-light text-muted-foreground border border-muted";
  }
  
  // Not started/incomplete states - muted light background
  if (statusLower.includes('not submitted') || 
      statusLower.includes('not watched') || 
      statusLower.includes('to be read') ||
      statusLower.includes('scheduled') ||
      statusLower.includes('not attempted') ||
      statusLower === 'not started' ||
      statusLower === 'incomplete') {
    return "bg-muted-light text-muted-foreground border border-muted";
  }
  
  // Warning states - warning light background
  if (statusLower.includes('interrupted') ||
      statusLower.includes('warning') ||
      statusLower.includes('pending')) {
    return "bg-warning-light text-warning border border-warning";
  }
  
  // Completed/submitted states - success light background
  if (statusLower.includes('submitted') || 
      statusLower.includes('watched') || 
      statusLower.includes('read') ||
      statusLower.includes('completed') ||
      statusLower.includes('attempted') ||
      statusLower.includes('live') ||
      statusLower === 'complete') {
    return "bg-success-light text-success border border-success";
  }
  
  // Default fallback
  return "bg-muted-light text-muted-foreground border border-muted";
}

// Date formatting utility function for consistent "DD Month YYYY" format
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// Date formatting with time for assessments and classes
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  const time = dateObj.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  
  return `${day} ${month} ${year} at ${time}`;
}

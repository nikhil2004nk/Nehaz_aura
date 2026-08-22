export const environment = {
  // Use Next.js rewrite proxy in production to prevent browser cross-site cookie blocking
  apiUrl: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'),
};

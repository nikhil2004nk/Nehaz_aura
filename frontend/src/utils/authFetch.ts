import { environment } from '../config/environment';
export const authFetch = async (url: string, options: RequestInit = {}) => {
  let res = await fetch(url, { ...options, credentials: "include" });
  
  if (res.status === 401) {
    const refreshRes = await fetch(`${environment.apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    if (refreshRes.ok) {
      res = await fetch(url, { ...options, credentials: "include" });
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }
  
  return res;
};

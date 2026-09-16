import axios from 'axios';

const apiClient = axios.create({
  // Dynamically use the current hostname so this works across the local network
  // In production (Render), VITE_API_URL will override this.
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8001/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ptm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to simulate ERP Login
export const loginMockERP = async (role, userId, tenantId) => {
  const response = await apiClient.post('/auth/mock-sso', {
    role,
    user_id: userId,
    tenant_id: tenantId
  });
  const token = response.data.access_token;
  localStorage.setItem('ptm_token', token);
  return token;
};

export default apiClient;

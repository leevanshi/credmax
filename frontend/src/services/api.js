import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('credmax_token');
  return { Authorization: `Bearer ${token}` };
};

export const cardService = {
  getAll: async () => {
    const response = await axios.get(`${API}/cards`, { headers: getHeaders() });
    return response.data;
  },
  
  create: async (cardData) => {
    const response = await axios.post(`${API}/cards`, cardData, { headers: getHeaders() });
    return response.data;
  },
  
  update: async (cardId, cardData) => {
    const response = await axios.put(`${API}/cards/${cardId}`, cardData, { headers: getHeaders() });
    return response.data;
  },
  
  delete: async (cardId) => {
    const response = await axios.delete(`${API}/cards/${cardId}`, { headers: getHeaders() });
    return response.data;
  }
};

export const recommendationService = {
  get: async (category, amount) => {
    const response = await axios.post(`${API}/recommendations`, 
      { category, amount }, 
      { headers: getHeaders() }
    );
    return response.data;
  }
};

export const transactionService = {
  getAll: async () => {
    const response = await axios.get(`${API}/transactions`, { headers: getHeaders() });
    return response.data;
  },
  
  create: async (transactionData) => {
    const response = await axios.post(`${API}/transactions`, transactionData, { headers: getHeaders() });
    return response.data;
  }
};

export const analyticsService = {
  getPatterns: async () => {
    const response = await axios.get(`${API}/analytics/spending-patterns`, { headers: getHeaders() });
    return response.data;
  },
  
  getInsights: async () => {
    const response = await axios.get(`${API}/analytics/insights`, { headers: getHeaders() });
    return response.data;
  }
};

export const rewardsService = {
  getExpiryAlerts: async () => {
    const response = await axios.get(`${API}/rewards/expiry-alerts`, { headers: getHeaders() });
    return response.data;
  },
  
  getRedemptionSuggestions: async () => {
    const response = await axios.get(`${API}/rewards/redemption-suggestions`, { headers: getHeaders() });
    return response.data;
  },
  
  getAllExpiryDates: async () => {
    const response = await axios.get(`${API}/rewards/all-expiry-dates`, { headers: getHeaders() });
    return response.data;
  }
};

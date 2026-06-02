import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sobatbatik_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api

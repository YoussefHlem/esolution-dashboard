import axios from 'axios'

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token
axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') // Get token from localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error cases (e.g., unauthorized, network issues)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...')

      // Optionally redirect to login page
    }

    return Promise.reject(error)
  }
)

export default axiosClient

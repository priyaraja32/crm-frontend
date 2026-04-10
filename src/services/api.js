import axios from "axios"

const API = axios.create({ baseURL: "https://crm-backend-8puj.onrender.com" })

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token")
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export const registerUser   = (data)     => API.post("/auth/register", data)
export const loginUser      = (data)     => API.post("/auth/login", data)
export const getCustomers   = ()         => API.get("/customers")
export const createCustomer = (data)     => API.post("/customers", data)
export const updateCustomer = (id, data) => API.put("/customers/" + id, data)
export const deleteCustomer = (id)       => API.delete("/customers/" + id)
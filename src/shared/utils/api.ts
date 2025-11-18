// src/shared/utils/api.ts
import axios from "axios";

// Em produção, o Nginx vai servir tudo no mesmo domínio, então a baseURL pode ser apenas '/api'
// ou vir de uma variável de ambiente injetada no build.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", 
});

export default api;
import axios from 'axios';

const customAxios = axios.create({
 baseURL: 'http://localhost:3000/api/', // Adjust if your API is on a different URL
});

customAxios.interceptors.request.use(
 (config) => {
   const token = localStorage.getItem('token');
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
 },
 (error) => {
   return Promise.reject(error);
 }
);

export default customAxios;
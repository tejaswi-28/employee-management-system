import customAxios from './customAxios';

const authService = {
 login: async (credentials: any): Promise<any> => {
   const response = await customAxios.post('auth/login', credentials);
   return response.data;
 },
 register: async (userData: any): Promise<any> => {
   const response = await customAxios.post('auth/register', userData);
   return response.data;
 },
};

export default authService;
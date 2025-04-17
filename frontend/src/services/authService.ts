import customAxios from './customAxios';

const authService = {
 login: async (credentials: any): Promise<any> => { //replace any with specific type
   const response = await customAxios.post('auth/login', credentials);
   return response.data;
 },
 register: async (userData: any): Promise<any> => { //replace any with specific type
   const response = await customAxios.post('auth/register', userData);
   return response.data;
 },
};

export default authService;
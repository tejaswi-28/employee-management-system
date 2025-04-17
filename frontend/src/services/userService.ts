import customAxios from './customAxios';
import { User } from '../types/user';

const userService = {

 getUsers: async (params: any): Promise<any> => {
   const response = await customAxios.get('users', { params });
   return response.data;
 },

 updateUser: async (id: string, roleData: { role: string },): Promise<User> => {
   const response = await customAxios.put(`users/${id}`, roleData);
   return response.data;
 },

}
 export default userService;
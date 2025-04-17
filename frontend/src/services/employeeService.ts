import customAxios from './customAxios';
import { Employee } from '../types/employee';

const employeeService = {
 getEmployees: async (params: any): Promise<any> => {
   const response = await customAxios.get('employees', { params });
   return response.data;
 },
 getEmployee: async (employeeId: string): Promise<Employee> => {
   const response = await customAxios.get(`employees/${employeeId}`);
   console.log("employeeService.getEmployee response:", response.data);
   return response.data;
 },
 createEmployee: async (data: any): Promise<Employee> => {
   const response = await customAxios.post('employees', data);
   return response.data;
 },
 updateEmployee: async (id: string, employeeData: Employee): Promise<Employee> => {
   const response = await customAxios.put(`employees/${id}`, employeeData);
   return response.data;
 },
 deleteEmployee: async (id: string): Promise<Employee> => {
   const response = await customAxios.delete(`employees/${id}`);
   return response.data;
 },
};

export default employeeService;
export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    password?: string;  
    [key: string]: any;
  }
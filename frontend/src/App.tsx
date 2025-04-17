import React from 'react';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import { AuthProvider } from './context/AuthContext';
    import Login from './components/Login';
    import Dashboard from './components/Dashboard';
    import "./App.css";
import EmployeeGrid from './pages/EmployeeGrid';
import DashboardPage from './components/DashBoardPage';
import AdminPanel from './pages/AdminPanel';

    const App: React.FC = () => {
     return (
       <AuthProvider>
         <Router>
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/" element={<Dashboard />}>
              <Route path="dashboard" element={<DashboardPage />}/>
              <Route path='admin' element={<AdminPanel />} />
              <Route path='employee' element={<EmployeeGrid />} />
             </Route>
           </Routes>
         </Router>
       </AuthProvider>
     );
    };

    export default App;
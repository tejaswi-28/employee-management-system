// WelcomePage.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', maxWidth: "1100px", margin: "0 2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Employee Management System!
      </Typography>
    </Box>
  );
};

export default DashboardPage;
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: theme.palette.grey[200],
                textAlign: "center",
                padding: theme.spacing(4),
            }}
        >
            <Typography variant="h1" color="error.main">
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" paragraph>
                The page you are looking for does not exist.
            </Typography>
            <Button component={Link} to="/dashboard" variant="contained" color="primary">
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFound;
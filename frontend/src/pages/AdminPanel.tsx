import React, { useState, useEffect } from "react";
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext"; 
import userService from "../services/userService";
import { User } from "../types/user";

const AdminPanel: React.FC = () => {
    const {userRole} = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [newUserRole, setNewUserRole] = useState<string>("");
    const [selectedUserToEdit, setSelectedUserToEdit] = useState<User | null>(null);
    const [editUserDialog, setEditUserDialog] = useState(false);

    useEffect(() => {
        if (userRole === "Admin") {
            fetchUsers();
        }
    }, [userRole]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers({});
            console.log("fetchUsers - Response:", data); // ADD THIS LINE
            console.log("fetchUsers - Type of Response:", typeof data); // AND THIS LINE
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleEditUserRole = (user: User) => {
        setSelectedUserToEdit(user);
        setNewUserRole(user.role);
        setEditUserDialog(true);
    };

    const handleSaveUserRole = async () => {
        if (selectedUserToEdit) {
            try {
                await userService.updateUser(selectedUserToEdit._id, { role: newUserRole });
                fetchUsers();
            } catch (error) {
                console.error("Error updating user role:", error);
            } finally {
                setEditUserDialog(false);
                setSelectedUserToEdit(null);
            }
        }
    };

    if (userRole !== "Admin") {
        return <Box sx={{margin: "2rem auto"}}>
            <h1>Access Denied</h1>
        </Box>;
    }

    return (
        <Box sx={{ margin: "2rem" }}>
            <Box>
                <h2>User Management</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditUserRole(user)}>
                                            <Edit color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit User Role Dialog */}
                <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)}>
                    <DialogTitle>Edit User Role</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                id="role-select"
                                value={newUserRole}
                                label="Role"
                                onChange={(e) => setNewUserRole(e.target.value)}
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Power User">Power User</MenuItem>
                                {/* Add other roles as needed */}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
                        <Button onClick={handleSaveUserRole}>Save</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default AdminPanel;
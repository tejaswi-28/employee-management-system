import React, { useEffect, useMemo, useState } from "react"
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  Button,
  IconButton,
  TextField,
  Box,
  useTheme,
} from "@mui/material"
import {
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import employeeService from "../services/employeeService"
import ConfirmationDialog from "../components/ConfirmationDialog"
import AddEditEmployee from "./AddEditEmployee"
import { Employee } from "../types/employee"
import { useAuth } from "../context/AuthContext"

export interface ApiResponse {
  docs: Employee[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

const EmployeeGrid: React.FC = () => {
  const { userRole} = useAuth()
  const theme = useTheme();
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filterText, setFilterText] = useState("")
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  )
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees({})
      setEmployees(data.docs)
      setTotalEmployees(data.docs.length);
      setPage(0);
    } catch (error) {
      console.error("Error fetching employees:", error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleAddEmployeeClick = () => {
    setSelectedEmployeeId(null)
    setEmployeeDialogOpen(true)
  }

  const handleEditEmployeeClick = (employee: any) => {
    setSelectedEmployeeId(employee._id)
    setEmployeeDialogOpen(true)
  }

  const handleDelete = (empId: string) => {
    setDeleteEmployeeId(empId)
    setDeleteConfirmationOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteEmployeeId) {
      try {
        await employeeService.deleteEmployee(deleteEmployeeId)
        const data: ApiResponse = await employeeService.getEmployees({})
        setEmployees(data.docs)
      } catch (error) {
        console.error("Error deleting employee:", error)
      } finally {
        setDeleteConfirmationOpen(false)
        setDeleteEmployeeId(null)
      }
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false)
    setDeleteEmployeeId(null)
  }

  const handleEmployeeSaved = (savedEmployee: Employee) => {
    if (savedEmployee._id) {
      setEmployees(
        employees.map(emp =>
          emp._id === savedEmployee._id ? savedEmployee : emp,
        ),
      );
    } else {
      setEmployees([...employees, savedEmployee]);
    }
    setEmployeeDialogOpen(false);
    fetchEmployees();
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEmployees = useMemo(() => {
    return filterText
      ? employees.filter(employee =>
          employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
          employee.department.toLowerCase().includes(filterText.toLowerCase()) ||
          employee.role.toLowerCase().includes(filterText.toLowerCase()) ||
          employee.location.toLowerCase().includes(filterText.toLowerCase())
        )
      : employees;
  }, [employees, filterText]);

  const visibleRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, page, rowsPerPage]);

  return (
    <Box sx={{margin: "2rem", justifyContent: "center"}}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      {userRole === 'Admin' && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddEmployeeClick}
        >
          Add Employee
        </Button>
      )}
        <TextField
          label="Filter Employees"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor: theme.palette.grey[300]}}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Location</TableCell>
              {userRole === 'Admin' && (
              <TableCell>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map(employee => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.location}</TableCell>
                {userRole === 'Admin' && (
                <TableCell>
                  <IconButton onClick={() => handleEditEmployeeClick(employee)}>
                    <Edit sx={{color: "yellow"}} />
                  </IconButton>
                  <IconButton
                  sx={{color: "red"}}
                    onClick={() => {
                      if (employee._id) {
                        handleDelete(employee._id)
                      } else {
                        console.warn("Employee has no _id for deletion")
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
          <TablePagination
          rowsPerPageOptions={[5, 10, 25, { value: -1, label: 'All' }]}
          colSpan={3}
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        content="Are you sure you want to delete this employee?"
      />

      <AddEditEmployee
        open={employeeDialogOpen}
        onClose={() => setEmployeeDialogOpen(false)}
        employeeId={selectedEmployeeId}
        onEmployeeSaved={handleEmployeeSaved}
      />
    </Box>
  )
}

export default EmployeeGrid;
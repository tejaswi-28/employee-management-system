// client/src/components/AddEmployee.tsx
import React, { useEffect, useState } from "react"
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material"
import employeeService from "../services/employeeService"
import { Employee } from "../types/employee"

interface AddEmployeeProps {
  open: boolean
  onClose: () => void
  employeeId: string | null
  onEmployeeSaved: (employee: Employee) => void // Callback to update parent
}

const AddEditEmployee: React.FC<AddEmployeeProps> = ({
  open,
  onClose,
  employeeId,
  onEmployeeSaved,
}) => {
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    fetchEmployeeDetails()
  }, [employeeId, open])

  const fetchEmployeeDetails = async () => {
    if (employeeId) {
      setIsEditMode(true)
      try {
        console.log("Fetching employee with ID:", employeeId)
        const employee = await employeeService.getEmployee(employeeId)
        if (employee) {
          setName(employee.name)
          setDepartment(employee.department)
          setRole(employee.role)
          setLocation(employee.location)
        }
        console.log("Employee data", employee)
      } catch (error) {
        console.error("Error fetching employee details:", error)
        // Handle error
      }
    } else {
      setIsEditMode(false)
      setName("")
      setDepartment("")
      setRole("")
      setLocation("")
    }
  }

  const handleSubmit = async () => {
    try {
      const employeeData = { name, department, role, location }
      let savedEmployee: Employee

      if (isEditMode && employeeId) {
        savedEmployee = await employeeService.updateEmployee(
          employeeId,
          employeeData,
        )
      } else {
        savedEmployee = await employeeService.createEmployee(employeeData)
      }

      onEmployeeSaved(savedEmployee)
      onClose()
    } catch (error) {
      console.error("Error saving employee:", error)
      // Handle error
    }
  }

  const title = isEditMode ? "Edit Employee" : "Add New Employee"
  const submitButtonText = isEditMode ? "Update" : "Add"

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle
        id="form-dialog-title"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="department"
          label="Department"
          type="text"
          fullWidth
          value={department}
          onChange={e => setDepartment(e.target.value)}
        />
        <TextField
          margin="dense"
          id="role"
          label="Role"
          type="text"
          fullWidth
          value={role}
          onChange={e => setRole(e.target.value)}
        />
        <TextField
          margin="dense"
          id="location"
          label="Location"
          type="text"
          fullWidth
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditEmployee

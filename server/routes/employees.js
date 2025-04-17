const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee"); // Import the Employee model
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const roleMiddleware = require("../middleware/roleMiddleware"); // Import roleMiddleware

// GET all employees (with pagination, search, and filter)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      role,
      location,
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // 'i' for case-insensitive
        { department: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (department) filter.department = department;
    if (role) filter.role = role;
    if (location) filter.location = location;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const employees = await Employee.paginate(filter, options);

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// GET a single employee by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching employee" });
  }
});

// CREATE a new employee (Admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      await newEmployee.save();
      res
        .status(201)
        .json({ message: "Employee created", employee: newEmployee });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating employee" });
    }
  }
);

// UPDATE an employee by ID (Admin only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true, // Return the updated document
          runValidators: true, // Validate the update
        }
      );
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee updated", employee });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error updating employee" });
    }
  }
);

// DELETE an employee by ID (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting employee" });
    }
  }
);

module.exports = router;

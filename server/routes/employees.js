const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee"); 
const authMiddleware = require("../middleware/authMiddleware"); 
const roleMiddleware = require("../middleware/roleMiddleware");

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
        { name: { $regex: search, $options: "i" } },
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
          new: true, 
          runValidators: true,
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

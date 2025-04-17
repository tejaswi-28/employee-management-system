const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { v4: uuidv4 } = require('uuid');

const EmployeeSchema = new mongoose.Schema({
  emp_id: { type: String, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
});

EmployeeSchema.pre('save', function (next) {
  if (!this.emp_id) {
    this.emp_id = `E${uuidv4().substring(0, 8).toUpperCase()}`; // Generate a UUID-based emp_id
  }
  next();
});
 
EmployeeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Employee", EmployeeSchema);

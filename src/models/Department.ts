// models/Department.js
import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// module.exports = mongoose.model("Department", departmentSchema);
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
export default Department;

import mongoose from "mongoose";

const DesignationSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
       trim: true
    },
    departmentName: {
       type: String,
       required: true,
       trim: true
    }
});

// Define a unique compound index on the combination of name and departmentName
DesignationSchema.index({ name: 1, departmentName: 1 }, { unique: true });

const Designation = mongoose.models.Designation || mongoose.model('Designation', DesignationSchema);
export default Designation;

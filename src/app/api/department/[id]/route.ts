// pages/api/department/[id].ts
import dbConnect from '@/lib/dbConnect';
import Department from '@/models/Department';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect(); // Ensure DB connection is established
  
    try {
      const { id } = params; // Accessing `id` from `params`
      const { name } = await req.json(); // Extract the updated name from the body
  
      if (!name) {
        return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }
  
      // Perform the update using the department ID
      const updatedDepartment = await Department.findByIdAndUpdate(id, { name }, { new: true });
  
      // If department doesn't exist, return 404
      if (!updatedDepartment) {
        return NextResponse.json({ error: "Department not found" }, { status: 404 });
      }
  
      // Return the updated department
      return NextResponse.json(updatedDepartment, { status: 200 });
    } catch (error) {
      console.error("Error updating department:", error);
      return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
    }
  }



// Delete a department by ID



export async function DELETE(request: Request, { params }: { params: any }) {
  await dbConnect();

  try {
    const { id } = params; // Now `params` has a defined type
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Department deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}


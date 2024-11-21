// pages/api/department/[id].ts
import dbConnect from '@/lib/dbConnect';
import Designation from '@/models/Designation';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect(); 
    try {
      const { id } = params; 
      const { name, departmentName } = await req.json(); 
  
      if (!name) {
        return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }
  
      const updatedDesignation = await Designation.findByIdAndUpdate(id, { name, departmentName},{ new: true });
  
      if (!updatedDesignation) {
        return NextResponse.json({ error: "Designation not found" }, { status: 404 });
      }
      return NextResponse.json(updatedDesignation, { status: 200 });
    } catch (error) {
      console.error("Error updating designation:", error);
      return NextResponse.json({ error: "Failed to update designation" }, { status: 500 });
    }
  }






export async function DELETE(request: Request, { params }: { params: any }) {
  await dbConnect();

  try {
    const { id } = params; 
    const deletedDesignation = await Designation.findByIdAndDelete(id);

    if (!deletedDesignation) {
      return NextResponse.json({ error: "Designation not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Designation deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting designation:", error);
    return NextResponse.json({ error: "Failed to delete designation" }, { status: 500 });
  }
}


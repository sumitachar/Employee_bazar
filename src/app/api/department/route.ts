// pages/api/departments.js
import dbConnect from '@/lib/dbConnect';
import Department from '@/models/Department';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();

  try {
      const { name } = await request.json();
      
      // Add any additional validation here if needed
      const existingName = await Department.findOne({ name });
      if (existingName) {
          return NextResponse.json({ error: "Department already exists" }, { status: 400 });
      }

      const newDepartment = new Department({ name});
      await newDepartment.save();

      return NextResponse.json({ message: "Department add successfully" }, { status: 201 });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to add department" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    // Fetch all departments from the database
    const departments = await Department.find();

    // Check if no departments are found
    if (!departments || departments.length === 0) {
      return NextResponse.json({ error: "No departments found" }, { status: 404 });
    }

    // Return the list of departments
    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}



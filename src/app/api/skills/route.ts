import dbConnect from "@/lib/dbConnect";
import Skills from "@/models/Skills";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { skillName, designationName } = await request.json();

    // Create and save the new skill entry
    const newSkill = new Skills({ skillName, designationName });
    await newSkill.save();

    return NextResponse.json({ message: "Skill added successfully" }, { status: 201 });
  } catch (error: any) {
    // Check for duplicate key error based on unique index
    if (error.code === 11000) {
      return NextResponse.json({ error: "Skill with this name and designation already exists" }, { status: 400 });
    }

    console.error("Error adding skill:", error);
    return NextResponse.json({ error: "Failed to add skill" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const url = new URL(request.url);

  // Get the query parameters from the request URL
  const action = url.searchParams.get('action');
  const designationName = url.searchParams.get('designationName'); // Fetch departmentName

  try {
    if (action === 'filterSkills' && designationName) {
      // Fetch all departments from the database
      const skills = await Skills.find({designationName});

      // Check if no departments are found
      if (!skills || skills.length === 0) {
        return NextResponse.json({ error: "No skill found" }, { status: 404 });
      }

      // console.log("skills",skills)

      // Return the list of departments
      return NextResponse.json(skills, { status: 200 });

    } else {
      // Fetch all departments from the database
      const skills = await Skills.find();

      // Check if no departments are found
      if (!skills || skills.length === 0) {
        return NextResponse.json({ error: "No skill found" }, { status: 404 });
      }

      // Return the list of departments
      return NextResponse.json(skills, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}

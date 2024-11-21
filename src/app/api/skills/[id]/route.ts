// pages/api/department/[id].ts
import dbConnect from '@/lib/dbConnect';
import Skills from '@/models/Skills';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect(); 
    try {
      const { id } = params; 
      const { skillName, designationName } = await req.json(); 
  
      if (!skillName) {
        return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }
  
      const updatedSkillName = await Skills.findByIdAndUpdate(id, { skillName, designationName},{ new: true });
  
      if (!updatedSkillName) {
        return NextResponse.json({ error: "Skill not found" }, { status: 404 });
      }
      return NextResponse.json(updatedSkillName, { status: 200 });
    } catch (error) {
      console.error("Error updating skill:", error);
      return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
    }
  }






export async function DELETE(request: Request, { params }: { params: any }) {
  await dbConnect();

  try {
    const { id } = params; 
    const deletedSkill = await Skills.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting skills:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}


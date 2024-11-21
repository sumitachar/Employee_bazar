import dbConnect from "@/lib/dbConnect";
import Designation from "@/models/Designation";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name, departmentName } = await request.json();

        // Check if a designation with the same name and departmentName already exists
        const existingDesignation = await Designation.findOne({ name, departmentName });
        if (existingDesignation) {
            return NextResponse.json({ error: "Designation already exists" }, { status: 400 });
        }

        // Create and save the new designation
        const newDesignation = new Designation({ name, departmentName });
        await newDesignation.save();

        return NextResponse.json({ message: "Designation added successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error adding designation:", error);
        return NextResponse.json({ error: "Failed to add designation" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();

    // Log the complete URL
    const url = new URL(request.url);

    // Get the query parameters from the request URL
    const action = url.searchParams.get('action');
    const departmentName = url.searchParams.get('departmentName'); // Fetch departmentName

    try {
        if (action === 'uniqueNames') {
            // Fetch unique designation names
            const designationNames = await Designation.distinct("name");

            if (!designationNames || designationNames.length === 0) {
                return NextResponse.json({ error: "No designation names found" }, { status: 404 });
            }
            return NextResponse.json(designationNames, { status: 200 });

        } else if (action === 'filterDesignation' && departmentName) {
            // Fetch designations where the departmentName matches the query parameter
            const designation = await Designation.find({ departmentName });

            if (!designation || designation.length === 0) {
                return NextResponse.json({ error: "No designation found for the given department" }, { status: 404 });
            }
            return NextResponse.json(designation, { status: 200 });

        } else {
            // If no action is specified, return all designations
            const designation = await Designation.find();

            if (!designation || designation.length === 0) {
                return NextResponse.json({ error: "No designation found" }, { status: 404 });
            }
            return NextResponse.json(designation, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch designations" }, { status: 500 });
    }
}



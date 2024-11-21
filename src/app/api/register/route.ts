import dbConnect from '@/lib/dbConnect';
import Register from '@/models/Register';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password } = await request.json();
        
        // Add any additional validation here if needed
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Register({ name, email, password: hashedPassword });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

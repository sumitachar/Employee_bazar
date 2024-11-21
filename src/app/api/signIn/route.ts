import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Register from '@/models/Register';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { email, password } = await req.json();

    // Connect to the database
    await dbConnect();

    // Find the user in the database by email
    const user = await Register.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email' },
        { status: 400 }
      );
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 400 }
      );
    }

    // Create a JWT token with the user ID
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '24h' // Token expiration (1 hour)
    });

    // Set the JWT token in a cookie (Optional)
    const headers = new Headers();
    headers.set('Set-Cookie', `authToken=${token}; Max-Age=3600; path=/; HttpOnly; Secure; SameSite=Strict`);

    // Respond with success and include the token, email, and user ID
    return NextResponse.json(
      { 
        message: 'Login successful', 
        token,
        user: { email: user.email, id: user._id } // Include email and ID
      },
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

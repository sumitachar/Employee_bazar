import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const headers = new Headers();
  
    // Clear the authToken cookie
    headers.set('Set-Cookie', 'authToken=; Max-Age=0; path=/; HttpOnly; Secure; SameSite=Strict');
  
    return NextResponse.json({ message: 'Logged out successfully' }, { headers, status: 200 });
  }
  
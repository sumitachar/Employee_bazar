import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import validator from "validator";

export async function POST(req: Request) {
  try {
    const reqBody = await req.formData();
    // console.log("reqBody",reqBody)

    // Extract general fields
    const fields = [
      "name", "co", "email", "phone", "address", "pinCode", "city", "gender",
      "maritalStatus", "noticePeriod", "gitHubLink", "linkedinLink", "departments", "designations"
    ];

    const data: Record<string, string | null> = {};
    for (const field of fields) {
      data[field] = reqBody.get(field)?.toString() || null;
    }

    // Validate required fields
    const requiredFields = ["name", "email", "phone"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Handle profile image and CV file
    const profileImageFile = reqBody.get("profileImage") as File | null;
    const cvFile = reqBody.get("cvFile") as File | null;

    // File upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Function to save the file
    const saveFile = async (file: File | Blob | string, prefix: string) => {
    
      if (file instanceof File) {
        const fileName = file.name; // Extract file name from `File`
        const filePath = path.join(uploadDir, `${prefix}-${Date.now()}-${fileName}`);
   
        const buffer = Buffer.from(await file.arrayBuffer());
    
        await fs.promises.writeFile(filePath, buffer);
    
        return `/uploads/${path.basename(filePath)}`;
      } 
    
      else if (typeof file === 'string') {
        const filePath = path.join(uploadDir, `${prefix}-${Date.now()}-${file}`);
        return `/uploads/${path.basename(filePath)}`;
      } 
      throw new Error('Invalid file type. Expected File or string.');
    };

    // Delete old file if new file is uploaded
    const deleteOldFile = async (oldFilePath: string | undefined) => {
      if (oldFilePath) {
        // Ensure that the oldFilePath doesn't contain an extra '/uploads' prefix
        const cleanedOldFilePath = oldFilePath.startsWith('/uploads/') 
          ? oldFilePath.substring('/uploads'.length) 
          : oldFilePath;
        
        const oldFileFullPath = path.join(uploadDir, cleanedOldFilePath);
        try {
          // Check if the file exists
          const fileExists = await fs.promises
            .access(oldFileFullPath)
            .then(() => true)
            .catch(() => false);
      
          if (fileExists) {
            // Delete the old file
            await fs.promises.unlink(oldFileFullPath);
            console.log(`Deleted old file: ${oldFileFullPath}`);
          } else {
            console.log("Old file does not exist:", oldFileFullPath);
          }
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    };

    // Parse array fields (e.g., academic details, work experience)
    const parseArrayField = (fieldName: string, isNumber: boolean = false) => {
      const array: any[] = [];
      reqBody.forEach((value, key) => {
        const match = key.match(new RegExp(`^${fieldName}\\[(\\d+)\\]\\[(\\w+)\\]`));
        if (match) {
          const [_, index, field] = match;
          array[Number(index)] = {
            ...(array[Number(index)] || {}),
            [field]: isNumber ? Number(value) : value.toString(),
          };
        }
      });
      return array;
    };

    const academicDetails = parseArrayField("academicDetails");
    const workExperience = parseArrayField("workExperience");
    const otherCertificates = parseArrayField("otherCertificates", true);
    const skills = Array.from(reqBody.entries())
      .filter(([key]) => key.startsWith("skills"))
      .map(([_, value]) => value.toString());

    // Connect to the database
    await dbConnect();

    // Check if a profile with the same email already exists
    const existingProfile = await Profile.findOne({ email: data.email });

    if (existingProfile) {
      // Update the existing profile
      if (profileImageFile) {
        if(profileImageFile instanceof File){
          await deleteOldFile(existingProfile.profileImage);
        }
        const profileImagePath = await saveFile(profileImageFile, "profile");
        existingProfile.profileImage = profileImagePath;
      }

      if (cvFile) {
        const cvFilePath = await saveFile(cvFile, "cv");
        existingProfile.cvFile = cvFilePath;
      }

      existingProfile.set({
        ...data,
        academicDetails,
        workExperience,
        otherCertificates,
        skills,
      });

      await existingProfile.save();

      return NextResponse.json(
        { message: "Profile updated successfully", profile: existingProfile },
        { status: 200 }
      );
    } else {
      // Create a new profile
      const profileImagePath = profileImageFile
        ? await saveFile(profileImageFile, "profile")
        : "";
      const cvFilePath = cvFile ? await saveFile(cvFile, "cv") : "";

      const newProfile = new Profile({
        ...data,
        profileImage: profileImagePath,
        cvFile: cvFilePath,
        academicDetails,
        workExperience,
        otherCertificates,
        skills,
      });

      await newProfile.save();

      return NextResponse.json(
        { message: "Profile created successfully", profile: newProfile },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const url = new URL(request.url);

  // Extract query parameters
  const action = url.searchParams.get("action");
  const email = url.searchParams.get("email");

  // console.log("action",action,"email",email)

  try {
    if (action === "getByEmail") {
      // Fetch data for a particular email
      if (!email) {
        return NextResponse.json(
          { error: "Missing email parameter in the request" },
          { status: 400 }
        );
      }

      if (!validator.isEmail(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      const details = await Profile.findOne({ email });

      if (!details) {
        return NextResponse.json(
          { error: "No details found for this email" },
          { status: 404 }
        );
      }

      return NextResponse.json(details, { status: 200 });
    } else if (action === "getByExcludeEmail") {
      // Fetch all data excluding a particular email
      if (!email) {
        return NextResponse.json(
          { error: "Missing email parameter in the request" },
          { status: 400 }
        );
      }

      if (!validator.isEmail(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      const details = await Profile.find({ email: { $ne: email } });

      if (details.length === 0) {
        return NextResponse.json(
          { error: "No profiles found excluding this email" },
          { status: 404 }
        );
      }

      return NextResponse.json(details, { status: 200 });
    } else {
      // Fetch all data if no specific action is given
      const details = await Profile.find();

      if (details.length === 0) {
        return NextResponse.json(
          { error: "No profiles found" },
          { status: 404 }
        );
      }

      return NextResponse.json(details, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error fetching details:", error);
    return NextResponse.json(
      { error: "Failed to fetch details", details: error.message },
      { status: 500 }
    );
  }
}


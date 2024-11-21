import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema({
  profileImage: { type: String, required: true }, // Ensure it's a string
  name: { type: String, required: true },
  co: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  pinCode: { type: String },
  city: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  academicDetails: [
    {
      degree: { type: String },
      institute: { type: String },
      year: { type: Number },
      percentage: { type: Number },
    },
  ],
  workExperience: [
    {
      company: { type: String },
      role: { type: String },
      year: { type: Number },
      duration: { type: Number },
    },
  ],
  departments: { type: String },
  designations: { type: String },
  skills: { type: [String] },
  noticePeriod: { type: String },
  otherCertificates: [
    {
      certificateName: { type: String },
      institute: { type: String },
      year: { type: Number },
    },
  ],
  preferableCities: { type: [String] },
  cvFile: { type: String }, // Store the CV file as a string URL
  gitHubLink: { type: String },
  linkedinLink: { type: String },
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export default Profile;

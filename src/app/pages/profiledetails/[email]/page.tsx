// src/app/profiledetails/[email]/page.tsx
"use client"
import React, { useEffect, useState } from "react";

interface ProfileProps {
  params: {
    email: string;
  };
}

const Page = ({ params }: ProfileProps) => {
  const { email } = params;
  const decodemail = decodeURIComponent(email);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (email) {
      fetchProfileDetails(decodemail);
    }
  }, [email]);

  const fetchProfileDetails = async (email: string) => {
    try {
      const response = await fetch(`/api/profiles?action=getByEmail&email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-200 text-white pt-20 min-h-screen">
      <div className="bg-gray-900 shadow-lg rounded-lg p-6 max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-semibold text-indigo-400 mb-6 text-center">Profile Overview</h1>

        {/* Profile Image */}
        {profileData?.profileImage && (
          <div className="flex justify-center mb-6">
            <img
              src={profileData?.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-600 shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 hover:opacity-90"
            />
          </div>
        )}

        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Name", value: profileData?.name },
            { label: "Email", value: profileData?.email },
            { label: "Phone", value: profileData?.phone },
            { label: "Address", value: profileData?.address },
            { label: "City", value: profileData?.city },
            { label: "Gender", value: profileData?.gender },
            { label: "Marital Status", value: profileData?.maritalStatus },
            { label: "Pin Code", value: profileData?.pinCode },
            { label: "C/O", value: profileData?.co },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-indigo-600 p-4 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
            >
              <p className="text-sm font-medium text-indigo-100">{item.label}</p>
              <p className="text-md text-gray-200 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Academic Details */}
        {profileData?.academicDetails.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">Academic Details</h2>
            {profileData?.academicDetails.map((academic: any, index: number) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg shadow-md mb-6 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
              >
                <p className="text-sm font-medium text-indigo-300">Degree</p>
                <p className="text-lg text-gray-200">{academic.degree}</p>
                <p className="text-sm font-medium text-indigo-300 mt-2">Institution</p>
                <p className="text-lg text-gray-200">{academic.institution}</p>
                <p className="text-sm font-medium text-indigo-300 mt-2">Year</p>
                <p className="text-lg text-gray-200">{academic.year}</p>
              </div>
            ))}
          </div>
        )}

        {/* Work Experience */}
        {profileData?.workExperience.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">Work Experience</h2>
            {profileData?.workExperience.map((experience: any, index: number) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg shadow-md mb-6 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
              >
                <p className="text-sm font-medium text-indigo-300">Company</p>
                <p className="text-lg text-gray-200">{experience.companyName}</p>
                <p className="text-sm font-medium text-indigo-300 mt-2">Role</p>
                <p className="text-lg text-gray-200">{experience.role}</p>
                <p className="text-sm font-medium text-indigo-300 mt-2">Duration</p>
                <p className="text-lg text-gray-200">{experience.duration}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills, Notice Period, Certificates */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Skills</h3>
            <ul className="list-disc pl-6 text-gray-200">
              {profileData?.skills.map((skill: any, index: any) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div
            className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Notice Period</h3>
            <p className="text-lg text-gray-200">{profileData?.noticePeriod}</p>
          </div>
        </div>

        {/* Preferable Cities */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-indigo-400 mb-4">Preferable Cities</h3>
          <p className="text-lg text-gray-200">{profileData?.preferableCities.join(", ")}</p>
        </div>

        {/* GitHub & LinkedIn */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">GitHub</h3>
            <a href={profileData?.gitHubLink} target="_blank" className="text-indigo-300 hover:text-indigo-500">
              {profileData?.gitHubLink}
            </a>
          </div>
          <div
            className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-2"
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">LinkedIn</h3>
            <a href={profileData?.linkedInLink} target="_blank" className="text-indigo-300 hover:text-indigo-500">
              {profileData?.linkedInLink}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

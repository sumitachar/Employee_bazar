"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Profile {
  email: string;
  profileImage?: string;
  name?: string;
  designations?: string;
  departments?: string;
}

function Home() {
  const [userMail, setUserMail] = useState<string | null>(null); // Use null to indicate uninitialized state
  const [loading, setLoading] = useState<boolean>(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const router = useRouter();

  // Function to fetch user email from localStorage
  const fetchUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserMail(parsedUser.email || "");
      } catch (err) {
        console.error("Error parsing stored user data:", err);
        setUserMail(""); 
      }
    } else {
      setUserMail(""); 
    }
  };


  useEffect(() => {
    fetchUserFromLocalStorage();
    const handleStorageChange = () => {
      fetchUserFromLocalStorage();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Cleanup listener on unmount
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch profiles based on user's email state
  useEffect(() => {
    if (userMail === null) {
      return;
    }
    if (userMail === "") {
      fetchAllProfileData();
    } else {
      fetchAllProfileDataExcludeMail();
    }
  }, [userMail]);

  const fetchAllProfileDataExcludeMail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/profiles?action=getByExcludeEmail&email=${encodeURIComponent(userMail as string)}`
      );

      if (!response.ok) throw new Error("Failed to fetch profile data");

      const data: Profile[] = await response.json();
      setAllProfiles(data || []);
    } catch (err) {
      console.error("Error fetching profile data (excluding user):", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profiles?action=getAllProfileData`);

      if (!response.ok) throw new Error("Failed to fetch all profile data");

      const data: Profile[] = await response.json();
      setAllProfiles(data || []);
    } catch (err) {
      console.error("Error fetching all profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 md:mt-1 justify-center px-4 bg-gray-100">
      <h1 className="flex w-full justify-center text-3xl text-center font-bold text-yellow-500 mt-8">
        Employee Bazar
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-yellow-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-full">
          {allProfiles.map((profile, index) => (
            <div
              key={index}
              className="w-full bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Profile Image */}
              <div className="flex justify-center mt-4">
                <img
                  src={profile?.profileImage || "/profile.jpg"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                />
              </div>

              {/* Profile Content */}
              <div className="text-center px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 mt-2">
                  {profile?.name || "John Doe"}
                </h2>
                <p className="text-gray-500">
                  {profile?.designations || "Employee"}
                </p>
                <p className="text-gray-400">
                  {profile?.departments || "Department"}
                </p>
                <Link
                  href={`/pages/profiledetails/${encodeURIComponent(
                    profile.email || ""
                  )}`}
                >
                  <div className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm py-2 px-4 rounded-lg shadow-md text-center">
                    View Profile
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

"use client"
import React, { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select from "react-select";
import { ClipLoader } from "react-spinners"; // Import spinner component
// Define the structure of your form data
interface AcademicDetail {
    degree: string;
    institute: string;
    year: number;
    percentage: number;
}

interface WorkExperience {
    company: string;
    role: string;
    year: number;
    duration: number;
}

interface Certificate {
    certificateName: string;
    institute: string;
    year: number;
}

interface FormDataType {
    profileImage: File | null;
    name: string;
    co: string;
    email: string;
    phone: string;
    address: string;
    pinCode: string;
    city: string;
    gender: string;
    maritalStatus: string;
    academicDetails: AcademicDetail[];
    workExperience: WorkExperience[];
    departments: string;
    designations: string;
    skills: string[];
    noticePeriod: string;
    otherCertificates: Certificate[];
    preferableCities: string[];
    cvFile: File | null;
    gitHubLink: string;
    linkedinLink: string;
}
const Page = () => {

    const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const currentYear = new Date().getFullYear();
    const [userMail, setUserMail] = useState<string>("");
    const router = useRouter();
    const [skills, setSkills] = useState([])
    const [skillsOptions, setSkillsOptions] = useState<any[]>([]);
    const [departments, setDepartments] = useState([])
    const [designations, setDesignations] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState<any>('')
    const [selectedDesignation, setSelectedDesignation] = useState<any>('')
    const [formData, setFormData] = useState<FormDataType>({
        profileImage: null,
        name: '',
        co: '',
        email: '',
        phone: '',
        address: '',
        pinCode: '',
        city: '',
        gender: '',
        maritalStatus: '',
        academicDetails: [{ degree: '', institute: '', year: 0, percentage: 0.0 }],
        workExperience: [{ company: '', role: '', year: 0, duration: 0 }],
        departments: '',
        designations: '',
        skills: [],
        noticePeriod: '',
        otherCertificates: [{ certificateName: '', institute: '', year: 0 }],
        preferableCities: [],
        cvFile: null,
        gitHubLink: '',
        linkedinLink: ''
    });

    useEffect(() => {
        const storedUser: any = localStorage.getItem("user");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
        const jsonStoreUser = JSON.parse(storedUser)

        if (storedUser && storedIsLoggedIn === "true") {
            setUserMail(jsonStoreUser?.email);
            setFormData(prevState => ({
                ...prevState,
                email: jsonStoreUser?.email,
            }));
        }
    }, []);
    // console.log("setFormData###",formData?.email)

    useEffect(() => {
        if (userMail) {
            // console.log("UserMail has been updated:", userMail);
            fetchProfileData();
        }
    }, [userMail]);

    const fetchProfileData = async () => {
        setLoading(true); // Show spinner
        try {
            const response = await fetch(
                `/api/profiles?action=getByEmail&email=${encodeURIComponent(userMail!)}`
            );

            if (!response.ok) throw new Error("Failed to fetch profile data");

            const data = await response.json();
            // console.log("profileData", data);

            if (data) {
                // Update `formData` state with skills mapped to the `Select` format
                setFormData((prevState) => ({
                    ...prevState,
                    profileImage: data.profileImage || null,
                    name: data.name || '',
                    co: data.co || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    pinCode: data.pinCode || '',
                    city: data.city || '',
                    gender: data.gender || '',
                    maritalStatus: data.maritalStatus || '',
                    gitHubLink: data.gitHubLink || '',
                    linkedinLink: data.linkedinLink || '',
                    otherCertificates: data.otherCertificates || prevState.otherCertificates,
                    academicDetails: data.academicDetails || prevState.academicDetails,
                    workExperience: data.workExperience || prevState.workExperience,
                    cvFile: data.cvFile || null,
                    designations: data.designations || '',
                    departments : data.departments || '',
                    skills: Array.isArray(data.skills)
                        ? data.skills.map((skill: any) => ({
                            value: skill, // Map to `Select` format
                            label: skill,
                        }))
                        : [],
                    noticePeriod: data.noticePeriod || '',
                }));
            } else {
                console.log("No profile data found for this email");
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false); // Hide spinner
        }
    };



    // Department Call
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("/api/department");
                if (!response.ok) {
                    throw new Error("Failed to fetch departments");
                }
                const data = await response.json();
                console.log("fetchDepartments", data);
                setDepartments(data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setDepartments([]);
            }
        };

        fetchDepartments();
    }, []);



    // Designation Call
    useEffect(() => {
        const fetchDesignation = async () => {

            try {
                const response = await fetch(`/api/designation?action=filterDesignation&departmentName=${encodeURIComponent(selectedDepartment)}`);
                if (!response.ok) throw new Error("Failed to fetch designation");

                const data = await response.json();

                if (data && data.length > 0) {
                    setDesignations(data);
                } else {
                    setDesignations([]);
                }
            } catch (error) {
                console.error("Error fetching designation:", error);
                setDesignations([]);
            }
        };
        fetchDesignation();

    }, [selectedDepartment])

    useEffect(() => {
        setFormData((prevData: any) => ({
            ...prevData,
            skills: [], // Update the specific field (e.g., skills)
        }));

        const fetchSkill = async () => {
            try {
                const response = await fetch(`/api/skills?action=filterSkills&designationName=${encodeURIComponent(selectedDesignation)}`);
                if (!response.ok) throw new Error("Failed to fetch skills");

                const data = await response.json();
                setSkills(data);

                if (Array.isArray(data) && data.length > 0) {
                    const formattedOptions = data.map((item) => ({
                        value: item?.skillName?.toLowerCase() || '',
                        label: item?.skillName || 'Unknown Skill',
                    })).filter(option => option.value); // Ensure valid options
                    setSkillsOptions(formattedOptions);
                } else {
                    console.warn("No skills found for the selected designation.");
                    setSkills([]);
                    setSkillsOptions([]);
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
                setSkills([]);
                setSkillsOptions([]);
            }
        };

        fetchSkill()

    }, [selectedDesignation])



    // console.log("formData", formData.cvFile)


    const handleAddRemove = (section: keyof FormDataType, index?: number, action?: 'add' | 'remove') => {
        setFormData((prevData) => {
            const updatedData = { ...prevData };

            if (section === 'academicDetails') {
                const updatedDetails = [...prevData.academicDetails];
                if (action === 'add') {
                    updatedDetails.push({ degree: '', institute: '', year: 0, percentage: 0.0 });
                } else if (action === 'remove' && index !== undefined) {
                    updatedDetails.splice(index, 1);
                }
                updatedData.academicDetails = updatedDetails;
            }

            if (section === 'workExperience') {
                const updatedExperience = [...prevData.workExperience];
                if (action === 'add') {
                    updatedExperience.push({ company: '', role: '', year: 0, duration: 0 });
                } else if (action === 'remove' && index !== undefined) {
                    updatedExperience.splice(index, 1);
                }
                updatedData.workExperience = updatedExperience;
            }

            if (section === 'otherCertificates') {
                const updatedCertificates = [...prevData.otherCertificates];
                if (action === 'add') {
                    updatedCertificates.push({ certificateName: '', institute: '', year: 0 });
                } else if (action === 'remove' && index !== undefined) {
                    updatedCertificates.splice(index, 1);
                }
                updatedData.otherCertificates = updatedCertificates;
            }

            return updatedData;
        });
    };


    // Generalized change handler for dynamic sections
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        section: keyof FormDataType,
        index?: number
    ) => {
        const { name, value } = e.target;

        setFormData((prevData) => {

            if (section === 'academicDetails' && index !== undefined) {

                const updatedAcademicDetails = [...prevData.academicDetails];
                updatedAcademicDetails[index] = {
                    ...updatedAcademicDetails[index],
                    [name]: value,
                };
                return { ...prevData, academicDetails: updatedAcademicDetails };
            }

            if (section === 'workExperience' && index !== undefined) {

                const updatedWorkExperience = [...prevData.workExperience];
                updatedWorkExperience[index] = {
                    ...updatedWorkExperience[index],
                    [name]: value,
                };
                return { ...prevData, workExperience: updatedWorkExperience };
            }

            if (section === 'otherCertificates' && index !== undefined) {

                const updatedCertificates = [...prevData.otherCertificates];
                updatedCertificates[index] = {
                    ...updatedCertificates[index],
                    [name]: value,
                };
                return { ...prevData, otherCertificates: updatedCertificates };
            }

            return { ...prevData, [name]: value };
        });
    };

    const handleSingleValueChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle file change for general fields
    const handleSkillValueChange = (selectedOptions: any, actionMeta: any) => {
        const name = actionMeta.name; // The `name` attribute from the `Select` component
        const value = selectedOptions; // The selected options

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value, // Update the specific field (e.g., skills)
        }));
    };





    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Show spinner during form submission
        try {
            // Convert formData to FormData object for file uploads
            const formDataToSend = new FormData();
            formDataToSend.append("profileImage", formData.profileImage!); // File
            formDataToSend.append("cvFile", formData.cvFile!); // File
            formDataToSend.append("name", formData.name);
            formDataToSend.append("co", formData.co);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("pinCode", formData.pinCode);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("gender", formData.gender);
            formDataToSend.append("maritalStatus", formData.maritalStatus);
            formDataToSend.append("departments", formData.departments);
            formDataToSend.append("designations", formData.designations);
            formDataToSend.append("noticePeriod", formData.noticePeriod);
            formDataToSend.append("gitHubLink", formData.gitHubLink);
            formDataToSend.append("linkedinLink", formData.linkedinLink);


            // Handle array fields (e.g., academicDetails, skills)
            formData.academicDetails.forEach((detail, index) => {
                formDataToSend.append(`academicDetails[${index}][degree]`, detail.degree);
                formDataToSend.append(`academicDetails[${index}][institute]`, detail.institute);
                formDataToSend.append(`academicDetails[${index}][year]`, detail.year.toString());
                formDataToSend.append(`academicDetails[${index}][percentage]`, detail.percentage.toString());
            });

            formData.workExperience.forEach((exp, index) => {
                formDataToSend.append(`workExperience[${index}][company]`, exp.company);
                formDataToSend.append(`workExperience[${index}][role]`, exp.role);
                formDataToSend.append(`workExperience[${index}][year]`, exp.year.toString());
                formDataToSend.append(`workExperience[${index}][duration]`, exp.duration.toString());
            });

            formData.otherCertificates.forEach((cert, index) => {
                formDataToSend.append(`otherCertificates[${index}][certificateName]`, cert.certificateName);
                formDataToSend.append(`otherCertificates[${index}][institute]`, cert.institute);
                formDataToSend.append(`otherCertificates[${index}][year]`, cert.year.toString());
            });

            formData.skills.forEach((skill: any, index) => {
                // Append the skill value (e.g., 'javascript')
                formDataToSend.append(`skills[${index}]`, skill.value);
            });

            // Debugging FormData
            for (const [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            // Uncomment the following lines to send the data to your API
            const response = await fetch('/api/profiles', {
                method: 'POST',
                body: formDataToSend, // FormData will handle the headers automatically
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Data saved:', result);
                alert('Form submitted successfully!');
                router.push("/");
            } else {
                const errorResult = await response.json();
                console.error('Failed to save data:', errorResult);
                alert('Failed to submit the form');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Hide spinner after submission
        }
    };




    return (
        <div className="relative p-4 mt-16 w-screen flex justify-center h-auto items-center bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1731530357802-08d982917720?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D')"
            }}>
            {loading && ( // Show spinner when loading is true
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <ClipLoader color="#fff" size={50} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full md:w-3/4 space-y-4 m-2">
                {/* Profile Picture */}
                <div className="mb-4 flex w-full justify-center items-center z-20">
                    <label
                        htmlFor="profileImage"
                        className="cursor-pointer w-32 h-32 rounded-full border-2 border-gray-300 bg-gray-100 flex justify-center items-center"
                    >
                        {formData.profileImage ? (
                            typeof formData.profileImage === 'string' ? (
                                // Show the profile image from the backend
                                <img
                                    src={formData.profileImage}
                                    alt="Profile Preview"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            ) : (
                                // Show the preview of the uploaded image
                                <img
                                    src={URL.createObjectURL(formData.profileImage)}
                                    alt="Profile Preview"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            )
                        ) : (
                            <span className="text-gray-400">Upload</span>
                        )}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="profileImage"
                        onChange={(e) => {
                            setFormData({ ...formData, profileImage: e.target.files?.[0] || null });
                        }}
                        className="hidden"
                    />
                </div>

                {/* Name */}
                <div className="mb-4 flex w-full z-20">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleSingleValueChange(e)}
                        placeholder="Full Name"
                        className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                    />
                </div>
                {/* C/O */}
                <div className="mb-4 flex w-full z-20">
                    <input
                        type="text"
                        name="co"
                        value={formData.co}
                        onChange={(e) => handleSingleValueChange(e)}
                        placeholder="C/O"
                        className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                    />
                </div>
                {/* Email and Phone*/}
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center z-20'>
                    <div className="">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleSingleValueChange(e)}
                            placeholder="Email"
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                            readOnly
                        />
                    </div>
                    <div className="">
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => handleSingleValueChange(e)}
                            placeholder="Phone Number"
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                {/* Adresess */}
                <div className="mb-4 flex w-full z-20">
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleSingleValueChange(e)}
                        placeholder="Address"
                        className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                    />
                </div>
                {/* Pin code and city */}
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center z-20'>
                    <div className="">
                        <input
                            type="text"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={(e) => handleSingleValueChange(e)}
                            placeholder="Pin Code"
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="">
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={(e) => handleSingleValueChange(e)}
                            placeholder="City"
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                {/* Gender and  Merital status */}
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center'>
                    <div className="z-20">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={(e: any) => handleSingleValueChange(e)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        >
                            <option value="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="z-20">
                        <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={(e: any) => handleSingleValueChange(e)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        >
                            <option value="">Marital Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                        </select>
                    </div>
                </div>
                {/* Academic Section */}
                <div className="mb-4 w-full z-20">
                    <h1 className='flex justify-start items-center w-full text-xl my-4 text-gray-300'>Academic Section</h1>
                    {formData.academicDetails.map((detail, index) => (
                        <div key={index} className="flex flex-col justify-center items-center w-full">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="degree">Degree Name</label>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={detail.degree}
                                        onChange={(e) => handleChange(e, 'academicDetails', index)}
                                        placeholder="Degree"
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="institute">Institute Name</label>
                                    <input
                                        type="text"
                                        name="institute"
                                        value={detail.institute}
                                        onChange={(e) => handleChange(e, 'academicDetails', index)}
                                        placeholder="Institute"
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="year">Year</label>
                                    <select
                                        name="year"
                                        value={detail.year || 0}
                                        onChange={(e) => handleChange(e, 'academicDetails', index)}
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    >
                                        <option value={0}>Select Year</option>
                                        {Array.from({ length: 50 }, (_, i) => {
                                            const year = currentYear - i;
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="percentage">Percentage</label>
                                    <input
                                        type="number"
                                        name="percentage"
                                        value={detail.percentage}
                                        onChange={(e) => handleChange(e, 'academicDetails', index)}
                                        placeholder="Percentage"
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex w-full justify-end">
                                {formData.academicDetails.length > 1 && (
                                    <button type="button" onClick={() => handleAddRemove('academicDetails', index, 'remove')}
                                        className="w-full md:w-1/4 bg-red-500 text-white rounded-lg p-2">
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button type="button" onClick={() => handleAddRemove('academicDetails', undefined, 'add')}
                            className="mt-4 bg-blue-500 text-white rounded-lg p-2 w-full">
                            Add Academic Detail
                        </button>
                    </div>
                </div>
                {/* Social Links Section */}
                <div className="mb-4 w-full z-20">
                    <h1 className="flex justify-start items-center w-full text-xl my-4 text-gray-300">Social Links</h1>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                        <div>
                            <input
                                type="url"
                                name="linkedinLink"
                                value={formData.linkedinLink}
                                onChange={(e) => handleSingleValueChange(e)}
                                placeholder="LinkedIn URL"
                                className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <input
                                type="url"
                                name="gitHubLink"
                                value={formData.gitHubLink}
                                onChange={(e) => handleSingleValueChange(e)}
                                placeholder="GitHub URL"
                                className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                            />
                        </div>

                    </div>
                </div>
                {/* Certificates Section */}
                <div className="mb-4 w-full z-20">
                    <h1 className='flex justify-start items-center w-full text-xl my-4 text-gray-300'>Certificates Section</h1>
                    {formData.otherCertificates.map((certificate, index) => (
                        <div key={index} className="flex flex-col justify-center items-center w-full">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="certificateName">Certificate Name</label>
                                    <input
                                        type="text"
                                        name="certificateName"
                                        value={certificate.certificateName}
                                        onChange={(e) => handleChange(e, 'otherCertificates', index)}
                                        placeholder="Certificate Name"
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="institute">Institute Name</label>
                                    <input
                                        type="text"
                                        name="institute"
                                        value={certificate.institute}
                                        onChange={(e) => handleChange(e, 'otherCertificates', index)}
                                        placeholder="Institute"
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="year">Year</label>
                                    <select
                                        name="year"
                                        value={certificate.year || 0}
                                        onChange={(e: any) => handleChange(e, 'otherCertificates', index)}
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    >
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 50 }, (_, i) => {
                                            const year = currentYear - i; // Adjust 2024 based on current year if needed
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className='flex w-full justify-end items-center my-4 '>
                                {formData.otherCertificates.length > 1 && (<button
                                    type="button"
                                    className="w-60 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                                    onClick={() => handleAddRemove('otherCertificates', index, 'remove')}
                                >
                                    Remove Certificate
                                </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white p-2 rounded-md transition duration-300"
                        onClick={() => handleAddRemove('otherCertificates', 0, 'add')}
                    >
                        Add Certificate
                    </button>
                </div>

                {/* Work experience */}
                <div className="mb-4 w-full z-20">
                    <h1 className='flex justify-start items-center w-full text-xl my-4 text-gray-300'>Work Experience Section</h1>
                    {formData.workExperience.map((experience, index) => (
                        <div key={index} className="flex flex-col justify-center items-center w-full">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="company">Company Name</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={experience.company}
                                        onChange={(e) => handleChange(e, 'workExperience', index)}
                                        placeholder="Company Name"
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="role">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={experience.role}
                                        onChange={(e) => handleChange(e, 'workExperience', index)}
                                        placeholder="Role"
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="year">Year</label>
                                    <select
                                        name="year"
                                        value={experience.year || 0}
                                        onChange={(e: any) => handleChange(e, 'workExperience', index)}
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    >
                                        <option value={0}>Select Year</option>
                                        {Array.from({ length: 50 }, (_, i) => {
                                            const year = currentYear - i; // Adjust 2024 based on current year if needed
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <label className="block text-gray-300 mb-2 text-md" htmlFor="duration">Duration</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={experience.duration}
                                        onChange={(e) => handleChange(e, 'workExperience', index)}
                                        placeholder="Duration"
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevents scroll input change
                                        className="input-field w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex w-full justify-end">
                                {formData.workExperience.length > 1 && (
                                    <button type="button" onClick={() => handleAddRemove('workExperience', index, 'remove')}
                                        className="w-full md:w-1/4 bg-red-500 text-white rounded-lg p-2">
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button type="button" onClick={() => handleAddRemove('workExperience', undefined, 'add')}
                            className="mt-4 bg-blue-500 text-white rounded-lg p-2 w-full">
                            Add Work Experience
                        </button>
                    </div>
                </div>
                {/* Notice Period Section */}
                <div className="mb-4 w-full z-20">
                    <h1 className="flex justify-start items-center w-full text-xl my-4 text-gray-300">Notice Period</h1>
                    <div>
                        <select
                            name="noticePeriod"
                            value={formData.noticePeriod}
                            onChange={(e: any) => handleSingleValueChange(e)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        >
                            <option value="">Select Notice Period</option>
                            <option value="1 month">1 Month</option>
                            <option value="2 months">2 Months</option>
                            <option value="3 months">3 Months</option>
                            <option value="Immediate">Immediate</option>
                        </select>

                    </div>
                </div>

                {/* Department and Designation */}
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center'>
                    <div className="mb-4 w-full">
                        <h1 className="flex justify-start items-center w-full text-xl my-4 text-gray-300">Department</h1>
                        <select
                            name="departments"
                            value={formData.departments}
                            onChange={(e) => { handleSingleValueChange(e); setSelectedDepartment(e.target.value) }}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        >
                            <option value="">Select Department</option>
                            {departments.map((d: any, index: any) => (
                                <option key={index} value={d.name}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="mb-4 w-full">
                        <h1 className="flex justify-start items-center w-full text-xl my-4 text-gray-300">Designation</h1>
                        <select
                            name="designations"
                            value={formData.designations}
                            onChange={(e) => { handleSingleValueChange(e); setSelectedDesignation(e.target.value) }}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
                        >
                            <option value="">Select Designation</option>
                            {designations.map((d: any, index: any) => (
                                <option key={index} value={d.name}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
                <div className="w-full relative">
                    <label
                        htmlFor="skills"
                        className="flex justify-start items-center w-full text-xl my-4 text-gray-300"
                    >
                        Select Skills
                    </label>
                    <Select
                        id="skills"
                        name="skills"
                        options={skillsOptions} // Pass all possible skill options
                        isMulti
                        value={formData.skills} // Bind the selected values to state
                        onChange={handleSkillValueChange} // Update state on selection
                        isSearchable
                        placeholder="Select skills..."
                        className="w-full"
                    />
                    <div className="mt-2 fixed">
                        <strong>Selected Skills:</strong>
                        <ul>
                            {formData.skills.map((item: any, index: number) => (
                                <li key={index}>{item.label}</li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="mb-4 w-full">
                    <h1 className="flex justify-start items-center w-full text-xl my-4 text-gray-300">CV</h1>

                    {/* File Input */}
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                cvFile: file || null, // Store the File object
                            }));
                        }}
                        className="w-full p-2 border text-gray-300 border-gray-300 rounded-md"
                    />

                    {/* Display the file name or path */}
                    {formData.cvFile && (
                        <div className="mt-2 text-sm text-gray-400">
                            Selected File:
                            {typeof formData.cvFile === 'string'
                                ? formData.cvFile // Display string directly
                                : formData.cvFile.name} {/* Display name if File object */}
                        </div>
                    )}
                </div>


                {/* Other sections like Skills, Notice Period, and others will go here */}

                <div className="mt-4 w-full text-center">
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded-lg"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>

    );
};

export default Page;









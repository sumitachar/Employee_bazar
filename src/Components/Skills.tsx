"use client";
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';

const Skills = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [designation, setDesignation] = useState([]);
  const [formData, setFormData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState(true);
  const [editSkill, setEditSkill] = useState({ id: null, skillName: "", designationName: "" });
  const [selectedDesignationFilter, setSelectedDesignationFilter] = useState("");

  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const response = await fetch("/api/designation?action=uniqueNames");
        if (!response.ok) throw new Error("Failed to fetch designation");

        const data = await response.json();

        if (data && data.length > 0) {
          setDesignation(data); 
        } else {
          setDesignation([]); 
        }
      } catch (error) {
        console.error("Error fetching designation:", error);
      }
    };
    fetchDesignation();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        if (!response.ok) throw new Error("Failed to fetch skills");

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchSkills();
  }, [updateFormData]);

  const handleAddSkill = async () => {
    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillName: newSkill.toUpperCase(),
          designationName: newDesignation.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add skill");
      }

      setUpdateFormData(!updateFormData);
      setNewSkill("");
      setNewDesignation("");
      setIsFormOpen(false);
    } catch (error: any) {
      console.error("Error adding skill:", error.message);
    }
  };


  const handleUpdateSkill = async () => {
    try {
      const response = await fetch(`/api/skills/${editSkill.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillName: editSkill.skillName.toUpperCase(),
          designationName: editSkill.designationName.toUpperCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update skill");

      setUpdateFormData(!updateFormData);
      setEditSkill({ id: null, skillName: "", designationName: "" });
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleDeleteDesignation = async (id: any) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete skill");

      setUpdateFormData(!updateFormData);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };


  // Filter designations based on selected department
  const filteredData = selectedDesignationFilter
    ? formData.filter((dept: any) => dept.designationName === selectedDesignationFilter)
    : formData;


  // console.log("filteredData", filteredData, editSkill)

  return (
    <div className="flex flex-col mt-8 text-sm md:text-md">
      <h2 className="text-md md:text-lg font-semibold mb-4 text-gray-700">Skills List</h2>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Skill
      </button>
      {isFormOpen && (
        <div className="mb-4 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter Designation name"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700 placeholder-gray-700"
            />
            <select
              value={newDesignation}
              onChange={(e) => setNewDesignation(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
            >
              <option value="">Select Department</option>
              {designation.map((des: any, index) => (
                <option key={index} value={des} className='text-gray-500 py-2'>
                  {des}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleAddSkill} className="bg-green-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      )}

      {/* Department Filter */}
      <div className="mb-4">
        <select
          value={selectedDesignationFilter}
          onChange={(e) => setSelectedDesignationFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
        >
          <option value="">Filter by Department</option>
          {designation.map((des: any, index) => (
            <option key={index} value={des}>
              {des}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Serial Number</th>
              <th className="py-3 px-6 text-left font-semibold">Skill Name</th>
              <th className="py-3 px-6 text-left font-semibold">Designation Name</th>
              <th className="py-3 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: any, index: number) => (
              <tr key={item.id} className="even:bg-gray-100 odd:bg-white">
                <td className="py-4 px-6 border-b text-gray-700">{index + 1}</td>
                <td className="py-4 px-6 border-b text-gray-700">
                  {editSkill.id === item._id ? (
                    <input
                      type="text"
                      value={editSkill.skillName}
                      onChange={(e) =>
                        setEditSkill((prev) => ({ ...prev, skillName: e.target.value }))
                      }
                      className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
                    />
                  ) : (
                    item.skillName
                  )}
                </td>
                <td className="py-4 px-6 border-b text-gray-700">
                  {editSkill.id === item._id ? (
                    <select
                      value={editSkill.designationName}
                      onChange={(e) =>
                        setEditSkill((prev) => ({ ...prev, designationName: e.target.value }))
                      }
                      className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
                    >
                      <option value="">Select Department</option>
                      {designation.map((d: any, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.designationName
                  )}
                </td>
                <td className="py-4 px-6 border-b flex items-center space-x-4">
                  {editSkill.id === item._id ? (
                    <button
                      onClick={handleUpdateSkill}
                      className="bg-green-600 text-white p-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditSkill({ id: item._id, skillName: item.skillName, designationName: item.designationName })}
                      className="bg-yellow-600 text-white p-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDesignation(item._id)}
                    className="bg-red-600 text-white p-2 rounded-full"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Skills;

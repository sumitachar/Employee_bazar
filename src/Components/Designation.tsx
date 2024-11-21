"use client";
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';

const Designation = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState(true);
  const [editDesignation, setEditDesignation] = useState({ id: null, name: "", departmentName: "" });
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        if (!response.ok) throw new Error("Failed to fetch departments");

        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const response = await fetch("/api/designation");
        if (!response.ok) throw new Error("Failed to fetch designations");

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchDesignation();
  }, [updateFormData]);

  const handleAddDesignation = async () => {
    try {
      const response = await fetch("/api/designation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newDesignation.toUpperCase(),
          departmentName: newDepartment.toUpperCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed to add designation");

      setUpdateFormData(!updateFormData);
      setNewDepartment("");
      setNewDesignation("");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding designation:", error);
    }
  };

  const handleUpdateDesignation = async () => {
    try {
      const response = await fetch(`/api/designation/${editDesignation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editDesignation.name.toUpperCase(),
          departmentName: editDesignation.departmentName.toUpperCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update designation");

      setUpdateFormData(!updateFormData);
      setEditDesignation({ id: null, name: "", departmentName: "" });
    } catch (error) {
      console.error("Error updating designation:", error);
    }
  };

  const handleDeleteDesignation = async (id:any) => {
    try {
      const response = await fetch(`/api/designation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete designation");

      setUpdateFormData(!updateFormData);
    } catch (error) {
      console.error("Error deleting designation:", error);
    }
  };

  // Filter designations based on selected department
  const filteredData = selectedDepartmentFilter
    ? formData.filter((dept:any) => dept.departmentName === selectedDepartmentFilter)
    : formData;

  return (
    <div className="flex flex-col mt-8 text-sm md:text-md">
      <h2 className="text-md md:text-lg font-semibold mb-4 text-gray-700">Designation List</h2>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Designation
      </button>
      {isFormOpen && (
        <div className="mb-4 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter Designation name"
              value={newDesignation}
              onChange={(e) => setNewDesignation(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700 placeholder-gray-700"
            />
            <select
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
            >
              <option value="">Select Department</option>
              {departments.map((dept:any) => (
                <option key={dept._id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleAddDesignation} className="bg-green-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      )}

      {/* Department Filter */}
      <div className="mb-4">
        <select
          value={selectedDepartmentFilter}
          onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
        >
          <option value="">Filter by Department</option>
          {departments.map((dept:any) => (
            <option key={dept._id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Serial Number</th>
              <th className="py-3 px-6 text-left font-semibold">Department Name</th>
              <th className="py-3 px-6 text-left font-semibold">Designation Name</th>
              <th className="py-3 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((dept:any, index:number) => (
              <tr key={dept.id} className="even:bg-gray-100 odd:bg-white">
                <td className="py-4 px-6 border-b text-gray-700">{index + 1}</td>
                <td className="py-4 px-6 border-b text-gray-700">
                  {editDesignation.id === dept._id ? (
                    <input
                      type="text"
                      value={editDesignation.name}
                      onChange={(e) =>
                        setEditDesignation((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
                    />
                  ) : (
                    dept.name
                  )}
                </td>
                <td className="py-4 px-6 border-b text-gray-700">
                  {editDesignation.id === dept._id ? (
                    <select
                      value={editDesignation.departmentName}
                      onChange={(e) =>
                        setEditDesignation((prev) => ({ ...prev, departmentName: e.target.value }))
                      }
                      className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
                    >
                      <option value="">Select Department</option>
                      {departments.map((d:any) => (
                        <option key={d._id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    dept.departmentName
                  )}
                </td>
                <td className="py-4 px-6 border-b flex items-center space-x-4">
                  {editDesignation.id === dept._id ? (
                    <button
                      onClick={handleUpdateDesignation}
                      className="bg-green-600 text-white p-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditDesignation({ id: dept._id, name: dept.name, departmentName: dept.departmentName })}
                      className="bg-yellow-600 text-white p-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDesignation(dept._id)}
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

export default Designation;

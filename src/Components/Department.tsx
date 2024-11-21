"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import React, { useState, useEffect } from "react";

const DepartmentTable = () => {
  const [departments, setDepartments] = useState<any>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");

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
      }
    };

    fetchDepartments();
  }, [newDepartment,editDepartmentName]);

  const handleAddDepartment = async () => {
    const upperCaseName = newDepartment.toUpperCase(); 
    try {
      const response = await fetch("/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: upperCaseName }), 
      });

      if (!response.ok) {
        throw new Error("Failed to add department");
      }

      const department = await response.json();
      setDepartments([...departments, department]); 
      setNewDepartment("");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };
 
  
  const handleEditDepartment = async () => {
    if (editDepartmentName.trim() && editDepartmentId) {
      try {
        const response = await fetch(`/api/department/${editDepartmentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editDepartmentName.trim().toUpperCase() }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update department");
        }
  
        setEditDepartmentId(null);
        setEditDepartmentName("");
      } catch (error) {
        // Log and handle errors
        console.error("Error updating department:", error);
      }
    }
  };
  
  
  

  // Function to handle the delete department
  const handleDeleteDepartment = async (id:any) => {
    try {
      const response = await fetch(`/api/department/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error("Failed to delete department");

      setDepartments((prevDepartments: any[]) =>
        prevDepartments.filter((dept) => dept._id !== id)
      );
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  
  return (
    <div className="flex flex-col mt-8 text-sm md:text-md">
      <h2 className="text-md md:text-lg font-semibold mb-4 text-gray-700">Department List</h2>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Department
      </button>

      {isFormOpen && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Department Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700 placeholder:gray-700"
          />
          <button
            onClick={handleAddDepartment}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Serial Number</th>
              <th className="py-3 px-6 text-left font-semibold">Department Name</th>
              <th className="py-3 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept: any, index: number) => (
              <tr key={dept.id} className="even:bg-gray-100 odd:bg-white">
                <td className="py-4 px-6 border-b text-gray-700 ">{index + 1}</td>
                <td className="py-4 px-6 border-b text-gray-700">
                  {editDepartmentId === dept._id ? (
                    <input
                      type="text"
                      value={editDepartmentName}
                      onChange={(e) => setEditDepartmentName(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded w-full mb-2 text-gray-700"
                    />
                  ) : (
                    dept.name
                  )}
                </td>
                <td className="py-4 px-6 border-b flex items-center space-x-4">
                  {editDepartmentId === dept._id ? (
                    <button
                      onClick={handleEditDepartment}
                      className="bg-green-600 text-white p-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditDepartmentId(dept._id);
                        setEditDepartmentName(dept.name);
                      }}
                      className="bg-yellow-600 text-white p-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDepartment(dept._id)}
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

export default DepartmentTable;

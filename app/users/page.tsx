"use client";
import React, { useEffect, useState } from "react";
import type { Delegate, DelegatesApiResponse } from "@/types/deligates";
// @ts-ignore
import uniqid from "uniqid";

export default function UserManagementPage() {
  const [load, setLoad] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    affiliation: "",
    role: "",
    description: "",
    year: "",
    email: "",
  });
  const [generatedId, setGeneratedId] = useState(uniqid());

  const roleOption = [
    "Chief Patron",
    "Patron",
    "Organizing Chair",
    "Program Chair",
    "General Chair",
    "Track Chair",
    "Publicity Chair",
    "Web Chair",
    "Finance Chair",
    "Publication Chair",
    "Local Organizer",
    "Joint-Organizing Chair",
    "Volunteer",
    "Author",
    "Presenter",
    "Technical Program Committee",
    "Technical Reviewer",
    "Speaker",
    "Delegate",
  ];

  const Loader = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/delegates`
      );
      if (!res.ok) throw new Error("Failed to fetch delegates");

      const data: DelegatesApiResponse = await res.json();

      console.log(data);

      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newUser = {
      Name: formData.name,
      Designation: formData.designation,
      Affiliation: formData.affiliation,
      Role: formData.role,
      Description: formData.description,
      Year: formData.year,
      Email: formData.email,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/delegates`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: newUser }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Something went wrong");

      await fetchUsers(); // Refresh user list
      setFormData({
        name: "",
        designation: "",
        affiliation: "",
        role: "",
        description: "",
        year: "",
        email: "",
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert("Failed to add user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMore = () => setVisibleCount((prev) => prev + 10);

  if (load)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User List */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Delegates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.slice(0, visibleCount).map((user) => (
            <div
              key={user.id}
              className="bg-gray-100 border rounded-xl shadow-sm p-4 hover:shadow-md transition duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.Name}`}
                    alt={user.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user.Name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {user.Designation} • {user.Affiliation}
                  </p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Role:</span> {user.Role}
                </p>
                <p>
                  <span className="font-medium">Year:</span> {user.Year}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.Email}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {user.Description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {users.length > visibleCount && (
          <button
            onClick={showMore}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Show More
          </button>
        )}
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Add New Delegate</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="id"
            value={generatedId}
            className="w-full p-2 border rounded bg-gray-100"
            placeholder="ID"
            readOnly
          />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Name"
            required
          />
          <input
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Designation"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
            required
          >
            <option value="">Select Role</option>
            {roleOption.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <input
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Affiliation"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
            required
          />
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Year"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Email"
            required
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded w-full ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500"
            } text-white flex items-center justify-center gap-2 cursor-pointer`}
            disabled={loading}
          >
            {loading ? (
              <>
                Adding Delegate... <Loader />
              </>
            ) : (
              "Add Delegate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

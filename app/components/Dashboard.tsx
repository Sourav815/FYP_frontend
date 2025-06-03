"use client";

import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface User {
  id: number;
  Role: string;
  Year: string;
  createdAt: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/delegates`
        );
        const json = await res.json();
        setUsers(json.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUserRoleStats = () => {
    const counts: Record<string, number> = {};
    users.forEach((user) => {
      const role = user.Role || "Unknown";
      counts[role] = (counts[role] || 0) + 1;
    });
    return counts;
  };

  const getUserYearStats = () => {
    const counts: Record<string, number> = {};
    users.forEach((user) => {
      const year = user.Year;
      counts[year] = (counts[year] || 0) + 1;
    });
    return counts;
  };

  const roleStats = getUserRoleStats();
  const yearStats = getUserYearStats();

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-600">
            Users by Role
          </h2>
          <div className="mx-auto w-[280px] h-[280px]">
            <Pie
              data={{
                labels: Object.keys(roleStats),
                datasets: [
                  {
                    label: "Users",
                    data: Object.values(roleStats),
                    backgroundColor: [
                      "#60a5fa",
                      "#34d399",
                      "#f472b6",
                      "#fbbf24",
                      "#c084fc",
                    ],
                  },
                ],
              }}
              options={{
                responsive: false,
                maintainAspectRatio: false,
              }}
              width={280}
              height={280}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-600">
            Users by Year
          </h2>
          <Bar
            data={{
              labels: Object.keys(yearStats),
              datasets: [
                {
                  label: "Users",
                  data: Object.values(yearStats),
                  backgroundColor: "#6366f1",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

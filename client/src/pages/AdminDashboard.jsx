import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [taskOverview, setTaskOverview] = useState({});
    const [memberInsights, setMemberInsights] = useState({ topContributors: [], inactiveMembers: [] });
    const [memberProgress, setMemberProgress] = useState([]);

    const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        const fetchAdminData = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = storedUser?.token;

            if (!token) {
                console.error("No token found! User may not be authenticated.");
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const taskRes = await axios.get("http://localhost:5000/api/team/tasks-overview", config);
                setTaskOverview(taskRes.data);

                const memberRes = await axios.get("http://localhost:5000/api/team/member-insights", config);
                setMemberInsights(memberRes.data);

                const progressRes = await axios.get(`http://localhost:5000/api/team/team-progress/${user.teamId}`, config);
                setMemberProgress(progressRes.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminData();
    }, [user]);

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-screen bg-black text-white">
            <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">Admin Dashboard</h1>

            {/* Task Overview */}
            <div className="mb-8 bg-[#2A2A2A] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">Task Overview</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-600 p-4 rounded-md text-center shadow-md">
                            <p className="text-lg font-bold">Completed</p>
                            <p className="text-2xl">{taskOverview.completedTasks || 0}</p>
                        </div>
                        <div className="bg-yellow-500 p-4 rounded-md text-center shadow-md">
                            <p className="text-lg font-bold">Pending</p>
                            <p className="text-2xl">{taskOverview.pendingTasks || 0}</p>
                        </div>
                        <div className="bg-red-500 p-4 rounded-md text-center shadow-md">
                            <p className="text-lg font-bold">Overdue</p>
                            <p className="text-2xl">{taskOverview.overdueTasks || 0}</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={[
                                    { name: "Completed", value: taskOverview.completedTasks || 0 },
                                    { name: "Pending", value: taskOverview.pendingTasks || 0 },
                                    { name: "Overdue", value: taskOverview.overdueTasks || 0 }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.name}: ${entry.value}`}
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Member Insights - Enhanced */}
            <div className="mb-8 bg-[#2A2A2A] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Member Insights</h2>
                <div className="grid grid-cols-2 gap-6">
                    {/* Top Contributors */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-green-300">🏆 Top Contributors</h3>
                        <div className="grid gap-4">
                            {memberInsights.topContributors.length > 0 ? (
                                memberInsights.topContributors.map((contributor, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-4 rounded-md shadow-lg ${index % 2 === 0 ? 'bg-[#333]' : 'bg-[#444]'} transform hover:scale-105 transition-transform`}
                                    >
                                        <p className="text-lg text-yellow-400">{contributor.name}</p>
                                        <p className="text-sm">Tasks Completed: {contributor.taskCount}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No top contributors yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Inactive Members */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-red-300">⚠️ Inactive Members</h3>
                        <div className="grid gap-4">
                            {memberInsights.inactiveMembers.slice(0, 3).map((member, index) => (
                                <div 
                                    key={index} 
                                    className={`p-4 rounded-md shadow-lg ${index % 2 === 0 ? 'bg-[#444]' : 'bg-[#333]'} transform hover:scale-105 transition-transform`}
                                >
                                    <p className="text-lg text-red-400">{member.name}</p>
                                    <p className="text-sm text-gray-300">Email: {member.email}</p>
                                    <p className="text-xs text-gray-400">No tasks assigned</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Progress Graph */}
            <div className="mb-8 bg-[#2A2A2A] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Team Progress</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={memberProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="gray" />
                        <XAxis dataKey="memberName" stroke="white" />
                        <YAxis stroke="white" />
                        <Tooltip contentStyle={{ backgroundColor: "#2A2A2A", color: "white" }} />
                        <Legend />
                        <Bar dataKey="completed" fill="#4CAF50" name="Completed Tasks" />
                        <Bar dataKey="total" fill="#2196F3" name="Total Tasks" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;

'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserDataPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/users", { credentials: "include" }); // assuming cookies/session
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;


    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-600 mb-4">Welcome to the User Data page!</p>
                    </div>
                    <div>
                        {/* logout */}
                        <button
                            onClick={async () => {
                                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                                localStorage.clear();
                                window.location.href = "/login";
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">User Name</th>
                                <th className="border p-2">Created At</th>
                                <th className="border p-2">Updated At</th>
                                <th className="border p-2">Chat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{user.email ? user.email : 'NA'}</td>
                                    <td className="border p-2">{user.user_name ? user.user_name.split("@")[0] : 'NA'}</td>
                                    <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                                    <td className="border p-2">{new Date(user.updatedAt).toLocaleString()}</td>
                                    {/* chat */}
                                    <td className="border p-2">
                                        <Link
                                            href={`/chat/${user._id}`}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Chat
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}
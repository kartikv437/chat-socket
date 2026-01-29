'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { CircleUserRound } from "lucide-react";
import Loader from "@/components/Loader";

export default function UserDataPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [userName, setUserName] = useState("");
    const [showUserNameInput, setShowUserNameInput] = useState(false);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/users", { credentials: "include" });
                if (res.status === 200) {
                    setLoader(false);
                    const data = await res.json();
                    setUsers(data.result);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoader(false);
            }
        }
        fetchUser();
    }, []);

    const editUserName = (name: string, ind: number) => {
        setShowUserNameInput(true);
        // setUserName(users[ind].user_name || "");
    };

    const saveUserName = (userName: string, ind: number) => {
        const updatedUsers = [...users];
        updatedUsers[ind] = { ...updatedUsers[ind], user_name: userName };
        setUsers(updatedUsers);
        setShowUserNameInput(false);
        fetch(`/api/users/${users[ind]._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                user_name: userName,
            }),
        });

    };

    if (loader) return <Loader />

    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-600 mb-4">Welcome to the User Data page!</p>
                    </div>
                    <div className="flex align-items-center gap-4">
                        <div className="w-8 text-gray-600 cursor-pointer">
                            <CircleUserRound onClick={() => window.location.href = "/profile"} />
                        </div>
                        {/* logout */}
                        <button
                            onClick={async () => {
                                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                                localStorage.clear();
                                window.location.href = "/login";
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
                            {users.map((user: any, ind: number) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{user.email ? user.email : 'NA'}</td>
                                    <td className="border p-2">
                                        {showUserNameInput ? (
                                            <div className="flex gap-2">
                                                <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    type="text"
                                                    value={userName}
                                                    onChange={(e) => setUserName(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => saveUserName(userName, ind)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <span>
                                                    {user.user_name ? user.user_name.split("@")[0] : "NA"}
                                                </span>

                                                <button
                                                    onClick={() => console.log("Edit user:", user._id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit User"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} onClick={() => editUserName(user.user_name || "", ind)} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                                    <td className="border p-2">{new Date(user.updatedAt).toLocaleString()}</td>
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
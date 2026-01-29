"use client";
import Loader from "@/components/Loader";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loader, setLoader] = useState(true);

  const userProfile = [
    { key: 'first_name', label: 'First Name', value: "" },
    { key: 'middle_name', label: 'Middle Name', value: "" },
    { key: 'last_name', label: 'Last Name', value: "" },
    { key: 'email', label: 'Email', value: "" },
    { key: 'age', label: 'Age', value: "" },
    { key: 'gender', label: 'Gender', value: "" },
    { key: 'dob', label: 'Date of Birth', value: "" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/users/me", { credentials: "include" });
        if (res.status === 200) {
          setLoader(false);
          const data = await res.json();
          setUserData(data.result);
          userProfile.forEach((item) => {
            item.value = data.result[item.key];
          })
          console.log(userProfile);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    }
    fetchData();
  }, []);

  const logOut = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/login";
      return;
    }
  }

  const saveFieldvalue = async (fieldName: string, fieldValue: string) => {
    const updatedUserData = { ...userData, [fieldName]: fieldValue };

    const res = await fetch(`/api/users/${userData._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        [fieldName]: fieldName === 'dob' ? fieldValue.split("T")[0] : fieldValue
      }),
    });
    if (res) {
      setUserData(updatedUserData);
      setEditingField(null);
    }
  };

  const editFieldName = (fieldName: string, fieldValue: string) => {
    setEditingField(fieldName);
    setFieldValue(fieldValue || "");
  }

  if (loader) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b">
        <button>
          <a href="/userData" className="btn btn-primary">
            Back to Users
          </a>
        </button>
        <button className="btn btn-danger" onClick={logOut}>
          Logout
        </button>
      </div>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
        <div className="max-w-8xl mx-auto border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Field</th>
                <th className="p-2 border">Value</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* <pre>{JSON.stringify(userProfile)}</pre> */}
              {userProfile.map((item) => (
                <tr key={item.key}>
                  <td className="p-2 border">{item.label}</td>
                  <td className="p-2 border">
                    {editingField === item.key ? (
                      <div className="flex gap-2">

                        {editingField === 'dob' ? (
                          <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="date"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                          />
                        ) : (
                          <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                          />
                        )}

                        <button
                          onClick={() => saveFieldvalue(item.key, fieldValue)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-4 py-2 border rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <span>
                            {userData && userData[item.key] ? userData[item.key] : "-NA-"}
                          </span>
                        </div>
                        <div className="">
                          <button
                            onClick={() => editFieldName(item.key, userData[item.key] || "")}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit User"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}



              {/* <tr>
                <td className="p-2 border">First Name</td>
                <td className="border p-2">
                  {editingField === "first_name" ? (
                    <div className="flex gap-2">

                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />

                      <button
                        onClick={() => saveFieldvalue("first_name", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.first_name ? userData.first_name : "-NA-"}
                        </span>
                      </div>
                      <div className="">
                        <button
                          onClick={() => editFieldName("first_name", userData.first_name)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Middle Name</td>
                <td className="p-2 border">
                  {editingField === "middle_name" ? (
                    <div className="flex gap-2">
                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                      <button
                        onClick={() => saveFieldvalue("middle_name", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.middle_name ? userData.middle_name : "-NA-"}
                        </span>
                      </div>

                      <div className="">
                        <button
                          onClick={() => console.log("Edit user:", userData._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} onClick={() => editFieldName('middle_name', userData.middle_name)} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Last Name</td>
                <td className="p-2 border">
                  {editingField === "last_name" ? (
                    <div className="flex gap-2">
                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                      <button
                        onClick={() => saveFieldvalue("last_name", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.last_name ? userData.last_name : "-NA-"}
                        </span>
                      </div>

                      <div className="">
                        <button
                          onClick={() => console.log("Edit user:", userData._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} onClick={() => editFieldName('last_name', userData.last_name)} />
                        </button>
                      </div>

                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Email</td>
                <td className="p-2 border">
                  {editingField === "email" ? (
                    <div className="flex gap-2">
                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                      <button
                        onClick={() => saveFieldvalue("email", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.email ? userData.email : "-NA-"}
                        </span>
                      </div>
                      <div className="">
                        <button
                          onClick={() => console.log("Edit user:", userData._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} onClick={() => editFieldName('email', userData.email)} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Gender</td>
                <td className="p-2 border">
                  {editingField === "gender" ? (
                    <div className="flex gap-2">
                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                      <button
                        onClick={() => saveFieldvalue("gender", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.gender ? userData.gender : "-NA-"}
                        </span>
                      </div>
                      <div className="">
                        <button
                          onClick={() => console.log("Edit user:", userData._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} onClick={() => editFieldName('gender', userData.gender)} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Date of Birth</td>
                <td className="p-2 border">
                  {editingField === "dob" ? (
                    <div className="flex gap-2">
                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="date"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                      <button
                        onClick={() => saveFieldvalue("dob", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.dob ? userData.dob : "-NA-"}
                        </span>
                      </div>
                      <div className="">
                        <button
                          onClick={() => console.log("Edit user:", userData._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} onClick={() => editFieldName('dob', userData.dob)} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Age</td>
                <td className="p-2 border">
                  {editingField === "age" ? (
                    <div className="flex gap-2">
                      <input className="w-full border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                      <button
                        onClick={() => saveFieldvalue("age", fieldValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <span>
                          {userData && userData.age ? userData.age : "-NA-"}
                        </span>
                      </div>

                      <div className="">
                        <button
                          onClick={() => console.log("Edit user:", userData._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} onClick={() => editFieldName('age', userData.age)} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr> */}


            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (result.success) {
            router.push('/userData'); 
        } else {
            alert('Login failed: ' + result.message);
        }
    };

    const signUpUser = async () => {
        const response = await fetch('/api/auth/signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (result.success) {
            alert('User signed up successfully!');
        } else {
            alert('Error signing up: ' + result.message);
        }
    }

    return (

        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                {/* <h1 className="text-2xl font-bold mb-4">User Data Management</h1> */}
                <div className="flex flex-col space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-md gap-4">

                    <form onSubmit={handleSubmit} className="p-4 border rounded">
                        <div className="mb-3">
                            <label>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-full grid grid-cols-1 gap-4">
                            <button type="submit" disabled={!email || !password} className="btn btn-primary">Login</button>
                            <button type="button" className="btn btn-secondary" onClick={signUpUser}>Sign Up</button>
                        </div>
                    </form>

                </div>

            </div>
        </>
    );
}
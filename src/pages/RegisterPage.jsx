import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "patient",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get existing users or empty array
        const existingUsers =
            JSON.parse(localStorage.getItem("users")) || [];

        // Check if user already exists
        const userExists = existingUsers.find(
            (u) => u.username === form.username
        );

        if (userExists) {
            alert("User already exists!");
            return;
        }

        const newUser = {
            id: Date.now(),
            username: form.username,
            password: form.password,
            role: form.role,
        };

        // Save updated users list
        localStorage.setItem(
            "users",
            JSON.stringify([...existingUsers, newUser])
        );

        alert("Account created successfully!");

        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bglight">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow w-80"
            >
                <h2 className="text-xl font-bold mb-4 text-primary">
                    Create Account
                </h2>

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full mb-3 p-2 border rounded"
                    value={form.username}
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-3 p-2 border rounded"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                />

                <select
                    className="w-full mb-4 p-2 border rounded"
                    value={form.role}
                    onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                    }
                >
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="family">Family</option>
                </select>

                <button className="w-full bg-primary text-white p-2 rounded">
                    Sign Up
                </button>

                <p className="text-xs mt-3 text-center">
                    Already have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
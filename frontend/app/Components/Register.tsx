"use client"; // 👈 necessário para usar useState
import React, { useState } from "react";

function postRegister(data: { name: string; email: string; password: string }) {
    return fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

type RegisterProps  = {
  goToLogin: () => void;
};
export default function Register({ goToLogin }: RegisterProps) {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "" });
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);
        try {
            const res = await postRegister(form);
            const data = await res.json();
            if (!res.ok) {
                setMessage({ type: "error", text: data.msg || "Registration failed." });
                return;
            }
            setMessage({ type: "success", text: "Registration successful! Redirecting..." });
            setTimeout(goToLogin, 1500);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An error occurred." });
            return;
        }
    };

    return (
        <section className="border-red-500 bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="bg-gray-100 p-5 flex rounded-3xl shadow-lg max-w-4xl">
                <div className="md:w-1/2 px-5">
                    <h2 className="text-2xl font-bold text-[#002D74]">Register</h2>
                    <p className="text-sm mt-4 text-[#002D74]">
                        If you have an account, please Register
                    </p>
                    <form className="mt-6" action="#" method="POST" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter Name"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black mt-2 mb-4 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                autoFocus
                                autoComplete="name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter Email Address"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg text-black bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={form.confirm_password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg text-black bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        {message && (
                            <div
                                className={`mt-4 text-center font-semibold ${
                                    message.type === "error" ? "text-red-600" : "text-green-600"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                        >
                            Register
                        </button>
                    </form>
                    <hr className="border-gray-500" />

                    <button onClick={goToLogin} className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
                        <span className="ml-4 text-black">Login</span>
                    </button>
                </div>

                <div className="w-1/2 md:block hidden">
                    <img
                        src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                        className="rounded-2xl"
                        alt="page img"
                    />
                </div>
            </div>
        </section>
    );
}

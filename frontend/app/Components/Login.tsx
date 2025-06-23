"use client"; // 👈 necessário para usar useState

import Image from "next/image";
import { useState } from "react";
function saveToken(token: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
}

type LoginForm = {
    email: string;
    password: string;
};

function useLoginForm(onSuccess: (token: string) => void) {
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://cuddly-palm-tree-494496wq57v27v4g-5000.app.github.dev/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                throw new Error("Login failed");
            }
            const data = await res.json();
            console.log(data)
            if (data.token) {
                onSuccess(data.token);
            } else {
                throw new Error("Token not found");
            }
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return { form, handleChange, handleSubmit, loading, error };
}
type LoginProps = {
  goToRegister: () => void;
};
export default function Login({ goToRegister }: LoginProps) {
    const { form, handleChange, handleSubmit, loading, error } = useLoginForm((token) => {
        saveToken(token);
        // You can redirect or show a success message here if needed
    });

    return (
        <section className="border-red-500 bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="bg-gray-100 p-5 flex rounded-3xl shadow-lg max-w-4xl">
                <div className="md:w-1/2 px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Login</h2>
                <p className="text-sm mt-4 text-[#002D74]">
                    If you have an account, please login
                </p>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div>
                    <label className="block text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter Email Address"
                        className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                        autoFocus
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

                    <div className="text-right mt-2">
                    <a
                        href="#"
                        className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                    >
                        Forgot Password?
                    </a>
                    </div>

                    {error && (
                        <div className="text-red-500 mt-2 text-sm">{error}</div>
                    )}

                    <button
                    type="submit"
                    className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                    disabled={loading}
                    >
                    {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div className="mt-7 grid grid-cols-3 items-center text-gray-500">
                    <hr className="border-gray-500" />
                    <p className="text-center text-sm">OR</p>
                    <hr className="border-gray-500" />
                </div>

                <button  onClick={goToRegister} className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
                
                    <span className="ml-4 text-black">Registre-se</span>
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

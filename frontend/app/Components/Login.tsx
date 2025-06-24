"use client"; // 👈 necessário para usar useState

import { useState } from "react";
import { useRouter } from "next/navigation";

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
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg);
            }
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
  goToResetPassword: () => void;   
  goToRegister: () => void;
};

export default function Login({ goToRegister, goToResetPassword }: LoginProps) {
    const router = useRouter();
    const { form, handleChange, handleSubmit, loading, error } = useLoginForm((token) => {
        
        saveToken(token);
        window.location.reload()
    });

    return (
        <section className="border-red-500 bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg p-5">
                <div className="w-full md:w-1/2 px-8">
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
<a
    href="#"
    onClick={(e) => {
        e.preventDefault();
        goToResetPassword();
    }}
    className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
>
    Forgot Password?
</a>


                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Ocorreu um erro! </strong>
                                <span className="block sm:inline">
                                    {error}
                                </span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"  onClick={() => window.location.reload()}><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                                </span>
                            </div>
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

                    <button onClick={goToRegister} className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
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

"use client";
import React, { useState } from "react";

type ResetPasswordProps = {
  goToLogin: () => void;
};

export default function ResetPassword({ goToLogin }: ResetPasswordProps) {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirm_password: "",
  });

  const [step, setStep] = useState<"email" | "reset">("email");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("http://localhost:5000/auth/getcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.msg || "Erro ao enviar código." });
        return;
      }
      setMessage({ type: "success", text: "Código enviado para o seu e-mail." });
      setStep("reset");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Erro na requisição." });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("http://localhost:5000/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.code,
          password: form.password,
          confirm_password: form.confirm_password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.msg || "Falha ao resetar senha." });
        return;
      }
      setMessage({ type: "success", text: "Senha redefinida com sucesso! Redirecionando..." });
      setTimeout(goToLogin, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Erro na requisição." });
    }
  };

  return (
    <section className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#002D74] mb-4">
          {step === "email" ? "Recuperar Senha" : "Redefinir Senha"}
        </h2>

        {message && (
          <div
            className={`mb-4 text-center font-semibold ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={sendEmail}>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black border focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3"
            >
              Enviar código
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black border focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <label className="block text-gray-700 mb-1">Código</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Código recebido por e-mail"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black border mb-3 focus:border-blue-500 focus:bg-white focus:outline-none"
            />

            <label className="block text-gray-700 mb-1">Nova Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nova senha"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black border mb-3 focus:border-blue-500 focus:bg-white focus:outline-none"
            />

            <label className="block text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="Confirme a senha"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black border mb-3 focus:border-blue-500 focus:bg-white focus:outline-none"
            />

            <button
              type="submit"
              className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-3"
            >
              Redefinir Senha
            </button>
          </form>
        )}

        <button
            onClick={(e) => {
                e.preventDefault();
                goToLogin();
            }}
            className="w-full mt-4 text-center text-sm text-gray-600 hover:underline"
            >
          Voltar para o Login
        </button>
      </div>
    </section>
  );
}

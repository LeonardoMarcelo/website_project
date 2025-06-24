"use client";
import { useState, useEffect } from 'react';
import ContentProducts from './Components/ContentProducts';
import Register from "./Components/Register";
import Login from './Components/Login';
import Reset from './Components/ResetPassword';
import { log } from 'console';

export default function Main() {
  const [page, setPage] = useState("login");
  const [auth, setAuth] = useState("deslogado");

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      const token = window.localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/auth/checkToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({}),
          });

          const data = await res.json();
          if (data && data.data.name && data.data.email && data.data.id) {
            window.localStorage.setItem('name', data.data.name);
            window.localStorage.setItem('email', data.data.email);
            window.localStorage.setItem('id', data.data.id);
          }
          if (!res.ok) {
            setAuth('deslogado');
          } else {
            setAuth('logado');
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          setAuth('deslogado');
        }
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      checkAuth();
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  if (auth == 'logado') {
    return <ContentProducts />;
  }

  if (auth != 'logado' && page === "login") {
    return <Login goToResetPassword={() => setPage("reset")} goToRegister={() => setPage("register")} setAuth={setAuth} />;
  }

  if (auth != 'logado' && page === "register") {
    return <Register goToLogin={() => setPage("login")} setAuth={setAuth} />;
  }
  if (auth != 'logado' && page === "reset") {
    return <Reset goToLogin={() => setPage("login")} setAuth={setAuth} />;
  }

  return null;
}

"use client";

import { useState } from 'react';
import Register from "./Components/Register";
import Login from './Components/Login';

import ContentProducts from './Components/ContentProducts';
export default function Main() {
  const [page, setPage] = useState("login");
  const [auth, setAuth] = useState("deslogado");

  return (
    <>
      {page === "login" ? (
        <Login goToRegister={() => setPage("register")} setAuth={setAuth} />
      ) : (
        <Register goToLogin={() => setPage("login")} setAuth={setAuth} />
      )}
      {auth === 'logado' && (
        <ContentProducts />
      )}
    </>
  );
}

// https://tailwindflex.com/@jaxstone/product-page-2
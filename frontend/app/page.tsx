"use client";

import { useState } from 'react';
import Register from "./Components/Register";
import Login from './Components/Login';

import ContentProducts from './Components/ContentProducts';
export default function Main() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" ? (
        <Login goToRegister={() => setPage("register")} />
      ) : (
        <Register goToLogin={() => setPage("login")} />
      )}
      {/* <ContentProducts/> */}
    </>
  );
}

// https://tailwindflex.com/@jaxstone/product-page-2
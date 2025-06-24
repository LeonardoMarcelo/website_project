import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  auth: string;
  handleLogout: () => void;
}

export default function Header({ auth, handleLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const userInfoRef = useRef<HTMLDivElement | null>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement)?.closest('button')?.getAttribute('aria-label') !== 'Mobile Menu'
      ) {
        setMobileMenuOpen(false);
      }
      if (
        userInfoRef.current &&
        !userInfoRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement)?.closest('button')?.getAttribute('aria-label') !== 'User menu'
      ) {
        setShowUserInfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="h-24 sm:h-32 flex items-center z-30 w-full relative">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
          Watch.ME
        </div>

        {/* Menu Desktop */}
        <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
          <a href="#Home" className="py-2 px-6 flex cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById("Home")?.scrollIntoView({ behavior: "smooth" }); }}>Home</a>
          <a href="#Projects" className="py-2 px-6 flex cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById("Projects")?.scrollIntoView({ behavior: "smooth" }); }}>Product</a>
          <a href="#Gallery" className="py-2 px-6 flex cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById("Gallery")?.scrollIntoView({ behavior: "smooth" }); }}>Gallery</a>
          <a href="#Footer" className="py-2 px-6 flex cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById("Footer")?.scrollIntoView({ behavior: "smooth" }); }}>Contact</a>
          {auth === "logado" && (
            <button onClick={handleLogout} className="py-2 px-6 outline outline-2 outline-offset-2 outline-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white rounded-lg transition-colors duration-200 cursor-pointer">
              Logout
            </button>
          )}
        </nav>

        {/* Botão Hamburguer */}
        <button onClick={toggleMobileMenu} aria-label="Mobile Menu" className="lg:hidden flex flex-col ml-4 z-40 relative">
          <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
          <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
          <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
        </button>

        {/* Menu Usuário */}
        <div className="relative z-50 ml-4">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setShowUserInfo((prev) => !prev)}
            aria-label="User menu"
            type="button"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {showUserInfo && (
            <div
              ref={userInfoRef}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-slide-down"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">User Info</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium">Status:</span> {auth === "logado" ? "Logged in" : "Logged out"} <br />
                <span className="font-medium">Nome:</span> {typeof window !== "undefined" ? localStorage.getItem("name") : ""} <br />
                <span className="font-medium">Email:</span> {typeof window !== "undefined" ? localStorage.getItem("email") : ""}
              </p>
              {auth === "logado" ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <p className="text-sm text-gray-500">Faça login para acessar mais recursos.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-40 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col mt-20 space-y-4 p-4">
          <a href="#Home" onClick={() => { setMobileMenuOpen(false); document.getElementById("Home")?.scrollIntoView({ behavior: "smooth" }); }}>Home</a>
          <a href="#Projects" onClick={() => { setMobileMenuOpen(false); document.getElementById("Projects")?.scrollIntoView({ behavior: "smooth" }); }}>Product</a>
          <a href="#Gallery" onClick={() => { setMobileMenuOpen(false); document.getElementById("Gallery")?.scrollIntoView({ behavior: "smooth" }); }}>Gallery</a>
          <a href="#Footer" onClick={() => { setMobileMenuOpen(false); document.getElementById("Footer")?.scrollIntoView({ behavior: "smooth" }); }}>Contact</a>
          {auth === "logado" && (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-pink-500 border border-pink-500 px-3 py-1 rounded hover:bg-pink-500 hover:text-white transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

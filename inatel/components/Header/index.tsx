"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User, GraduationCap, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { setLocalStorageItem, getLocalStorageItem } from "@/hooks/useLocalStorage";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Verificar estado inicial do localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = getLocalStorageItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    // Verificar estado inicial
    checkLoginStatus();

    // Escutar eventos de mudança no localStorage
    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      if (event instanceof StorageEvent) {
        if (event.key === "isLoggedIn") {
          checkLoginStatus();
        }
      } else if (event instanceof CustomEvent) {
        if (event.detail?.key === "isLoggedIn") {
          checkLoginStatus();
        }
      }
    };

    // Escutar evento customizado (mesma aba)
    window.addEventListener("localStorageChange", handleStorageChange as EventListener);
    // Escutar evento storage (outras abas)
    window.addEventListener("storage", handleStorageChange as EventListener);

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange as EventListener);
      window.removeEventListener("storage", handleStorageChange as EventListener);
    };
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setLocalStorageItem("isLoggedIn", "false");
    router.push("/login");
  };

  const handleStudentView = () => {
    router.push("/studant");
  };

  return (
    <header
      className="w-full"
      style={{
        background: "radial-gradient(circle at 20%, #007ce1, #015294, #015eab)",
      }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Image
          src="/assets/Inatel Branco.png"
          alt="Inatel Logo"
          width={120}
          height={40}
          priority
        />
        {isLoggedIn && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Perfil"
            >
              <User className="text-white w-6 h-6" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    Rafael Cardoso
                  </p>
                </div>
                <button
                  onClick={handleStudentView}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Trocar para visão de estudante
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

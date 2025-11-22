"use client";

import { useState } from "react";
import Card from "@/components/Card";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { setLocalStorageItem } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email] = useState("rafael.cardoso@inatel.br");
  const [password] = useState("password123");
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Salvar no localStorage usando o hook
    setLocalStorageItem("isLoggedIn", "true");
    setLocalStorageItem("User", "Rafael Cardoso");

    router.push("/teacher");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Faça login para continuar
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={() => {}}
              name="email"
              disabled
              required
            />
            
            <TextField
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={() => {}}
              name="password"
              disabled
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-6"
            >
              Entrar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}


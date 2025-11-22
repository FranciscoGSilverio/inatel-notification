"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/teacher");
    }
    else {
      router.push("/login");
    }
  }, []);

  return (
    <div>
    </div>
  );
}

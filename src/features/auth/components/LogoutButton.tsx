"use client";

import { useLogout } from "../hooks/useLogout";

export default function LogoutButton({ className }: { className?: string }) {
  const { logout, pending } = useLogout();
  return (
    <button type="button" className={className} onClick={logout} disabled={pending}>
      Sair
    </button>
  );
}

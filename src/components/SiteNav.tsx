"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import type { Usuario } from "@/features/auth/types";
import LogoutButton from "@/features/auth/components/LogoutButton";
import styles from "./SiteHeader.module.css";

type SiteNavProps = {
    usuario: Usuario | null;
};

export default function SiteNav({ usuario }: SiteNavProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);
    const isHome = pathname === "/";
    const isLogin = pathname === "/login";
    const isRegister = pathname === "/registrar";
    const isDashboard = pathname.startsWith("/dashboard");
    const isProfile = pathname.startsWith("/perfil");

    const linkClass = (active: boolean) => `${styles.navLink}${active ? ` ${styles.active}` : ""}`;

    function renderLinks() {
        return (
            <>
                <div className={styles.linkGroup}>
                    <Link href="/" aria-current={isHome ? "page" : undefined} className={linkClass(isHome)}>
                        Receitas
                    </Link>
                    {usuario && (
                        <Link
                            href="/dashboard"
                            aria-current={isDashboard ? "page" : undefined}
                            className={linkClass(isDashboard)}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
                <div className={styles.actionGroup}>
                    {usuario ? (
                        <>
                            <Link
                                href="/perfil"
                                aria-current={isProfile ? "page" : undefined}
                                className={linkClass(isProfile)}
                            >
                                Perfil
                            </Link>
                            <LogoutButton className={styles.logout} />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                aria-current={isLogin ? "page" : undefined}
                                className={linkClass(isLogin)}
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/registrar"
                                aria-current={isRegister ? "page" : undefined}
                                className={styles.cta}
                            >
                                Criar conta
                            </Link>
                        </>
                    )}
                </div>
            </>
        );
    }

    const mobileLink = (href: string, label: string, active: boolean, extra = "") => (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${styles.mobileLink}${active ? ` ${styles.mobileActive}` : ""}${extra}`}
            onClick={closeMenu}
        >
            {label}
        </Link>
    );

    return (
        <nav aria-label="Principal" className={styles.nav}>
            <div className={styles.desktopLinks}>{renderLinks()}</div>
            <IconButton
                className={styles.menuButton}
                aria-label="Abrir menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="right"
                open={menuOpen}
                onClose={closeMenu}
                slotProps={{
                    paper: { className: styles.drawerPaper },
                    backdrop: { className: styles.drawerBackdrop },
                }}
            >
                <div className={styles.drawerHeader}>
                    <span className={styles.drawerTitle}>Menu</span>
                    <IconButton className={styles.closeButton} aria-label="Fechar menu" onClick={closeMenu}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles.mobileLinks}>
                    {mobileLink("/", "Receitas", isHome)}
                    {usuario && mobileLink("/dashboard", "Dashboard", isDashboard)}
                    {usuario && mobileLink("/perfil", "Perfil", isProfile)}
                </div>
                <div className={styles.mobileActions}>
                    {usuario ? (
                        <LogoutButton className={styles.mobileLogout} />
                    ) : (
                        <>
                            {mobileLink("/registrar", "Criar conta", isRegister, ` ${styles.mobilePrimary}`)}
                            {mobileLink("/login", "Entrar", isLogin, ` ${styles.mobileSecondary}`)}
                        </>
                    )}
                </div>
            </Drawer>
        </nav>
    );
}

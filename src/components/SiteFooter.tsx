import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p>
                    Feito com ❤️ por{" "}
                    <a href="https://lucasboareto.vercel.app" target="_blank" rel="noopener noreferrer">
                        Lucas Boareto
                    </a>
                </p>
            </div>
        </footer>
    );
}
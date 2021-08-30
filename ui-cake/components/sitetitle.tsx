import styles from "@/styles/components/sitetitle.module.scss";
import Link from "next/link"

const SiteTitle = () => {
    return (
        <>
            <h1 className={styles.sitetitle}>
                <Link href="/" passHref>
                    CakeCTF
                </Link>
            </h1>
        </>
    );
}

export default SiteTitle;

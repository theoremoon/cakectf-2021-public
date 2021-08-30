import Link from 'next/link'
import { useRouter } from 'next/router';
import React from "react";
import styles from "@/styles/components/menu.module.scss";
import cx from "classnames";

type AnchorProps = React.ComponentProps<"a">;


const ActiveLink = ({ href, ...props }: AnchorProps) => {
    const { asPath } = useRouter();
    if (asPath === href) {
        props.className = cx(props.className, styles.active);
    }
    return (
        <Link href={href || ''}><a {...props}></a></Link>
    )
};

const Menu = () => {
    return (
        <nav className={styles.nav}>
            <ul>
                <li>
                    <ActiveLink href="/tasks">Tasks</ActiveLink>
                </li>
                <li>
                    <ActiveLink href="/ranking">Ranking</ActiveLink>
                </li>

                    <li>
                        <Link href="/">Login</Link>
                    </li>
                    <li>
                        <Link href="/">Register</Link>
                    </li>

            </ul>
        </nav>
    )
}
export default Menu;

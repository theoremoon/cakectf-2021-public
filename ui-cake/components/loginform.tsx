import React from "react";
import styles from "@/styles/components/loginform.module.scss";
import cx from "classnames";

type LoginFormProps = React.ComponentPropsWithoutRef<'form'>;

const LoginForm = ({children, ...props}: LoginFormProps) => {
    props.className = cx(props.className, styles.loginform);
    return (
        <div className={styles.wrapper}>
            <form {...props}>
                {React.Children.map(children, (child) => {
                    return (
                        <div className={styles.formitem}>
                            {child}
                        </div>
                    );
                })}
            </form>
        </div>
    );
};

export default LoginForm;

import styles from "@/styles/components/text.module.scss";
import cx from "classnames";
import React, {ComponentPropsWithoutRef, ComponentPropsWithRef} from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <input ref={ref} className={styles.text} {...props} />
    );
});
    
export default Input;

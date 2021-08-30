import React, {ComponentPropsWithoutRef} from "react";
import styles from "@/styles/components/textarea.module.scss";

type TextareaProps = ComponentPropsWithoutRef<"textarea">;

// eslint-disable-next-line react/display-name
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    return (
        <textarea ref={ref} className={styles.textarea} {...props} />
    );
});
    
export default Textarea;

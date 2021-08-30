import styles from "@/styles/components/button.module.scss";
import cx from "classnames";

type ButtonProps = React.ComponentProps<'button'>;

const Button = ({...props}: ButtonProps) => {
    props.className = cx(props.className, styles.button);

    return (
        <button {...props} />
    )
}

export default Button;

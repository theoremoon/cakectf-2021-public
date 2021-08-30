import cx from "classnames"
import styles from "@/styles/components/table.module.scss";

type TableProps = React.ComponentPropsWithoutRef<'table'>;

const Table = ({...props}: TableProps) => {
    props.className = cx(props.className, styles["table"])
    return <table {...props}></table>
}

export default Table;
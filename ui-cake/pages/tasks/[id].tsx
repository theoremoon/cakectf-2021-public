import Link from "next/link";
import Tasks from "@/components/tasks";
import TaskDialog from "@/components/taskdialog"
import styles from "@/styles/pages/tasks/id.module.scss";
import { useRecoilValue } from "recoil";
import tasksState from "@/recoil/tasks";
import { useRouter } from "next/router";
import ranking from "@/data/info-update.json";

const Task = () => {
    const router = useRouter();
    const { id } = router.query;
    const tasks = useRecoilValue(tasksState);

    const task = tasks.filter(t => t.id === Number(id));
    return (
        <>
            <div className={styles["dialog-wrapper"]}>
                {task.length === 0 ? <div className={styles.dialog}>Loading...</div> : <TaskDialog className={styles.dialog} task={task[0]} />}
            </div>
            <Tasks />
            <Link href="/tasks">
                <div className={styles["dialog-background"]}></div>
            </Link>
        </>
    )
}

export default Task;

export const getStaticPaths = async () => {
    const paths = Object.entries(ranking.challenges).map(([k, v]: [string, any]) => ({
        params: { id: v.id.toString() },
    }));
    return {
        paths: paths,
        fallback: false,
    }
}


export const getStaticProps = async({}) => {
    return {
        props: {},
        revalidate: 1,
    }
}
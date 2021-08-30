import tasksState from "@/recoil/tasks";
import { useRecoilValue } from "recoil";
import styles from "@/styles/components/tasks.module.scss";
import Task from "@/components/task";
import { orderBy } from "lodash";
import { useRouter } from "next/router";


const Tasks = () => {
    const tasks = useRecoilValue(tasksState);
    const router = useRouter();
    if (!tasks) {
        router.push("/");
        return (<></>);
    }
    return (
        <div className={styles.tasks}>
            {orderBy(tasks, ['score', 'name']).map(task => <Task task={task} key={task.name} />)}
        </div>
    )
}
export default Tasks;

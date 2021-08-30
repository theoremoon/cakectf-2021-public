import Link from "next/link";
import styles from "@/styles/components/task.module.scss";
import cx from "classnames";
import { Task as TaskType } from "@/recoil/tasks";
import React from "react";

type taskProps = {
    task: TaskType;
} & React.ComponentPropsWithoutRef<'div'>;

const Task = ({ task, ...props }: taskProps) => {
    let className = cx(props.className, styles.task);
    return (
        <Link href={{
            pathname: '/tasks/[id]',
            query: { id: task.id },
        }}>
            <div {...props} className={className} >
                <div className={styles["task-cover"]}>
                    <div className={styles["task-upper"]}>
                        <div className={styles["task-name"]}>
                            {task.name}
                        </div>
                    </div>
                    <div className={styles["task-middle"]}>
                        <div className={styles["task-score"]}>{task.score}</div>

                    </div>
                    <div className={styles["task-lower"]}>
                        <div className={styles["task-tags"]}>
                            {task.tags.map(tag => <div className={styles["task-tag"]} key={tag}>{tag}</div>)}
                        </div>

                        <div className={styles["task-solves"]}>{task.solved_by.length} solves</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Task;
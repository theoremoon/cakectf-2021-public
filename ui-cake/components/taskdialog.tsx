import { Task } from "@/recoil/tasks";
import Input from "@/components/input";
import styles from "@/styles/components/taskdialog.module.scss";
import React, { useState } from "react";
import Button from "./button";
import cx from "classnames";
import Link from "next/link";

type TaskDialogPropsType = {
    task: Task;
} & React.ComponentPropsWithoutRef<'div'>;

const TaskDialog = ({ task, ...props }: TaskDialogPropsType) => {
    const [flag, setFlag] = useState('');
    props.className = cx(props.className, styles["dialog"])
    const is_solved = false;
    return (
        <div {...props}>
            <div className={styles["dialog-left"]}>
                <div className={styles["dialog-head"]}>
                    {is_solved && '🎂'}
                    {task.name} - {task.score}
                </div>
                <div className={styles["dialog-tags"]}>
                    {task.tags.map(tag => <div className={styles["dialog-tag"]} key={tag}>{tag}</div>)}
                </div>
                <div className={styles["dialog-description"]} dangerouslySetInnerHTML={{ __html: task.description }}></div>
                <div className={styles["dialog-attachments"]}>{task.attachments && task.attachments.map(a => (
                    <a key={a.name} href={a.url} download>{a.name}</a>
                ))}</div>
                <div className={styles["dialog-author"]}>author: {task.author}</div>
                <div>
                    <Input type="text" placeholder="CakeCTF{NamuNamu...}" onChange={(e) => setFlag(e.target.value)} value={flag} />
                    <Button>Submit</Button>
                </div>
            </div>
            <div className={styles["dialog-right"]}>
                <div className={styles["dialog-right-inner"]}>
                    <div className={styles["dialog-solvenum"]}>{task.solved_by.length} solves</div>

                    <div className={styles["dialog-solves"]}>
                        {task.solved_by.map(t => (
                            <div className={styles["dialog-solve-team"]} key={t.team_id}>
                                <Link href={'/team/' + t.team_id}>
                                    {t.team_name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TaskDialog;
import { Task } from "@/recoil/tasks";
import { orderBy } from "lodash";
import React from "react";
import styles from "@/styles/components/rankingtable.module.scss"
import { TeamState } from "@/recoil/ranking";
import { dateFormat } from "@/lib/date";
import cx from "classnames";
import CountryFlag from "@/components/countryflag";
import Link from "next/link";

type RankingTableProps = {
    tasks: Task[],
    teams: TeamState[],
} & React.ComponentProps<'table'>;

const RankingTable = ({ tasks, teams,  ...props }: RankingTableProps) => {
    const first_blood_times = new Map<string, number>();
    const first_blood_list = new Map<string,string>();
    const ordered_tasks = orderBy(tasks, ['score', 'name'], ['asc', 'asc']);
    teams.forEach(t => {
        t.taskStats.forEach(task => {
            if (!first_blood_times.has(task.task_name) || first_blood_times.get(task.task_name)! > task.solved_at) {
                first_blood_times.set(task.task_name, task.solved_at);
                first_blood_list.set(task.task_name, t.team_id);
            }
        })
    })
    props.className = cx(props.className, styles["ranking-table"])
    return (
        <table {...props}>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Country</th>
                    <th>Team</th>
                    <th>Score</th>
                    {ordered_tasks.map(t => <th key={t.id} className={styles["task-name"]}><div>{t.name}</div></th>)}
                </tr>
            </thead>
            <tbody>
                {teams.map(t => (
                    <tr key={t.team_id}>
                        <td className={styles["team-pos"]}>
                            {t.pos === 1 ? '🎂' : t.pos}
                        </td>
                        <td className={styles["team-country"]}>
                            {t.country ? <CountryFlag code={t.country} title={t.country} /> : '' }
                        </td>
                        <td className={styles["team-name"]} title={t.team}>
                            <Link href={"/team/" + t.team_id}>
                                {t.team}
                            </Link>
                        </td>
                        <td className={styles["team-score"]}>{t.score}</td>
                        {ordered_tasks.map(task => {
                            const solved = t.taskStats.filter(solved_task => solved_task.task_name === task.name);
                            const id = t.team_id.toString() + task.id.toString();
                            if (solved.length > 0 && first_blood_list.get(task.name) === t.team_id) {
                                return <td className={styles["team-solve-flag"]} key={id} title={`${t.team} solved ${task.name} at ${dateFormat(solved[0].solved_at)}`}>🎂</td>;
                            } else if (solved.length > 0 ) { 
                                return <td className={styles["team-solve-flag"]} key={id} title={`${t.team} solved ${task.name} at ${dateFormat(solved[0].solved_at)}`}>🍰</td>;
                            } else {
                                return <td className={styles["team-solve-flag"]} key={id}></td>
                            }
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default RankingTable;
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import rankingState from "@/recoil/ranking";
import styles from "@/styles/components/team.module.scss";
import { orderBy } from "lodash";
import { dateFormat } from "@/lib/date";
import CountryFlag from "@/components/countryflag";
import SeriesChart from "@/components/SeriesChart";
import ranking from "@/data/info-update.json";


const Team = () => {
    const router = useRouter();
    const id = router.query.id;
    const ranking = useRecoilValue(rankingState);

    const teams = ranking.teams.filter(t => t.team_id == id);
    if (teams.length === 0) {
        return (<>No such Team</>);
    }
    const team = teams[0];

    const teamInfoList = ranking.teams.flatMap(t => t.team_id == id ? [t] : []);
    const teamInfo = teamInfoList.length > 0 ? teamInfoList[0] : null;
    return (
        <>
            <h1>
                {team.country ? <CountryFlag code={team.country} title={team.country} /> : ''}
                {team.team}
                <span className={styles["team-info"]}>
                    {teamInfo ? (
                        <>
                            Rank {teamInfo.pos} / {teamInfo.score} points
                        </>
                    ) : (
                        'No solves yet'
                    )}
                </span>
            </h1>

            <SeriesChart teams={[team.team]} />

            {teamInfo && (
                <table className={styles["score-table"]}>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Score</th>
                            <th>Solved At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderBy(teamInfo.taskStats, ['solved_at'], ['desc']).map(task => (
                            <tr key={task.task_name}>
                                <td>{task.task_name}</td>
                                <td>{task.score}</td>
                                <td>{dateFormat(task.solved_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default Team;

export const getStaticPaths = async () => {
    const paths = Object.entries(ranking.ranking.standings).map(([k, v]: [string, any]) => ({
        params: { id: v.team_id.toString() },
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
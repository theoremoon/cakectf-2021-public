import RankingTable from "@/components/rankingtable";
import rankingState from "@/recoil/ranking";
import tasksState from "@/recoil/tasks";
import { useRecoilValue } from "recoil";
import SeriesChart from "@/components/SeriesChart";

const Ranking = () => {
    const tasks = useRecoilValue(tasksState);
    const ranking = useRecoilValue(rankingState);
        let topTeams = ranking.teams.slice(0, 10).map(t => t.team);
        return (
            <>
                <SeriesChart teams={topTeams} />
                <RankingTable tasks={tasks} teams={ranking.teams} />
            </>
        )
};

export default Ranking;

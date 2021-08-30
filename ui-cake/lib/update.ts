import { TeamState, TeamStateRecvType, toTeamState } from "@/recoil/ranking";
import { Task } from "@/recoil/tasks";
import result from "@/data/info-update.json";

export type Result = {
    tasks: Task[];
    ranking: {
        standings: TeamState[],
        tasks: string[],
    }
}

const update = async (force: boolean) => {
    return <Result>{
        tasks: result.challenges,
        ranking: {
            standings: result.ranking.standings.map(toTeamState),
            tasks: result.ranking.tasks,
        },
    };
}

export default update;

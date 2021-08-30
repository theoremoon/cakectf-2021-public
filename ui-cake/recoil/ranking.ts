import { atom } from "recoil"

interface TaskStateRecvType {
    time: number
    points: number
}

export type TeamStateRecvType = {
    pos: number;
    team: string;
    country: string;
    score: number;
    taskStats: Object;
    team_id: number;
    last_submission: number;
}

export type TaskState = {
    task_name: string;
    score: number;
    solved_at: number;
}

export type TeamState = {
    pos: number;
    team: string;
    country: string;
    score: number;
    taskStats: TaskState[];
    team_id: string;
    last_submission: number;
}

export const toTeamState = (state: TeamStateRecvType): TeamState => {
    const { taskStats: stats, ...values } = state;
    let taskStats: TaskState[] = [];
    Object.entries(stats).forEach(([k, v]) => {
        const vv = v as TaskStateRecvType;
        taskStats.push({
            task_name: k,
            score: vv.points,
            solved_at: vv.time,
        })
    })
    const { team_id, ...props } = values;
    return {
        taskStats: taskStats,
        team_id: team_id.toString(),
        ...props,
    }
}

export type Ranking = {
    teams: TeamState[],
    tasks: string[],
}

const rankingState = atom<Ranking>({
    default: <Ranking>{},
    key: 'ranking',
})

export default rankingState;
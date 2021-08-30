import { atom } from "recoil"

export type Attachment = {
    name: string;
    url: string;
}

export type SolvedBy = {
    solved_at: number;
    team_id: number;
    team_name: string;
}

export type Task = {
    id: number;
    name: string;
    description: string;
    flag: string;
    author: string;
    score: number;
    tags: string[];
    attachments: Attachment[];
    solved_by: SolvedBy[];

    is_open: boolean;
    is_survey: boolean;
}

const tasksState = atom<Task[]>({
    key: 'tasks', 
    default: []
});

export default tasksState;
import { atom } from "recoil";

export type Config = {
    ctf_name: string;
    start_at: number;
    end_at: number;
    score_expr: string;
    register_open: boolean;
    ctf_open: boolean;
    lock_second: number;
    lock_duration: number;
    lock_count: number;
} | null;

const configState = atom<Config>({
    key: "config",
    default: null,
})

export default configState;
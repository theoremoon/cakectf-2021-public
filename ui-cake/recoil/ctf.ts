import { atom } from "recoil"

export type CTF = {
    start: number;
    end: number;
    name: string;
} | null;

const ctfState = atom<CTF>({
    key: "ctf",
    default: null,
})

export default ctfState;
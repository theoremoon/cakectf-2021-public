import { atom } from "recoil";
import { v4 } from "uuid";

export type Message = {
    key: string;
    value: string;
}

const messagesState = atom<Message[]>({
    key: "message",
    default: [],
});

export const newMessage = (value: string) => {
    return <Message>{
        key: v4(),
        value: value,
    }
}

export default messagesState;
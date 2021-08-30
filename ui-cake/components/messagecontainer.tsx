import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import messageState, { Message } from "@/recoil/messages";
import styles from "@/styles/components/messagecontainer.module.scss";

type MessageBoxProps = {
    message: Message;
} 

const MessageBox = (props: MessageBoxProps) => {
    return (
        <div className={styles.messagebox}>
            {props.message.value}
        </div>
    )
}

const MessageContainer: React.FC = ({children}) => {
    const [messages, setMessages] = useRecoilState<Message[]>(messageState);
    useEffect(() => {
        setTimeout(() => {
            setMessages(messages => messages.slice(1));
        }, 10000);
    }, [messages])
    return (
        <>
            <div className={styles.messagecontainer}>
            {messages.map(x => (
                x.value && <MessageBox message={x} key={x.key} />
            ))}
            </div>
            {children}
        </>
    )
};

export default MessageContainer;
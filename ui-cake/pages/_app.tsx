import React from 'react'
import { AppProps } from 'next/app'
import SiteTitle from '../components/sitetitle'
import Menu from '../components/menu'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import MessageContainer from "@/components/messagecontainer";
import dynamic from "next/dynamic";
import update from '@/lib/update'
import tasksState from '@/recoil/tasks'
import rankingState from '@/recoil/ranking'
import ctfState from '@/recoil/ctf'
import nprogress from 'nprogress';
import { Router } from 'next/router'
import "nprogress/nprogress.css";
import '@/styles/global.scss'
import Head from "next/head";
import info from "@/data/info.json";


const LoadInfo = () => {
    const setCTF = useSetRecoilState(ctfState);
    setCTF({
        start: info.ctf_start,
        end: info.ctf_end,
        name: info.ctf_name,
    })
    return (<></>);
}

const Update = () => {
    const setTasks = useSetRecoilState(tasksState);
    const setRanking = useSetRecoilState(rankingState);
        update(false).then(data => {
            setTasks(data.tasks);
            setRanking({
                teams: data.ranking.standings,
                tasks: data.ranking.tasks,
            });
        })
    return (<></>);
}

nprogress.configure({
    showSpinner: false,
})
Router.events.on('routeChangeStart', () => nprogress.start());
Router.events.on('routeChangeComplete', () => nprogress.done());
Router.events.on('routeChangeError', () => nprogress.done());


const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <RecoilRoot>
            <Head>
                <title>CakeCTF 2021</title>
            </Head>

            <LoadInfo />
            <Update />
            <MessageContainer>

                <div id="container">
                    <header>
                        <SiteTitle />
                        <Menu />
                    </header>
                    <main id="main">
                        <Component {...pageProps} />
                    </main>
                </div>
            </MessageContainer>

        </RecoilRoot>
    );
}
export default dynamic(() => Promise.resolve(App), {
    ssr: false,
})


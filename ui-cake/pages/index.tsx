import ctfState from "@/recoil/ctf";
import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { dateFormat } from "@/lib/date";
import useInterval from "use-interval"
import { useState } from "react";
import Link from 'next/link'


const Index: NextPage = () => {
    const ctf = useRecoilValue(ctfState);

    const [now, setNow] = useState(new Date().valueOf() / 1000);
    useInterval(() => {
        setNow(new Date().valueOf() / 1000)
    }, 1000);
    const countDown = () => {
        if (!ctf) return '';
        const d = ctf.start - now;
        const days = ("" + Math.floor(d / (60 * 60 * 24))).padStart(2, "0");
        const hours = (
            "" + Math.floor((d % (60 * 60 * 24)) / (60 * 60))
        ).padStart(2, "0");
        const minutes = ("" + Math.floor((d % (60 * 60)) / 60)).padStart(2, "");
        const seconds = ("" + Math.floor(d % 60)).padStart(2, "");
        return days + "d " + hours + ":" + minutes + ":" + seconds;
    }

    if (!ctf) {
        return <>Loading...</>;
    }
    return (
        <>
            <section>
                <p>{dateFormat(ctf.start)} &ndash; {dateFormat(ctf.end)}</p>
                {now < ctf.start && <p>CTF will start in {countDown()}.</p>}
                {ctf.start <= now && now <= ctf.end && <p>CTF is now running!</p>}
                {ctf.end < now && <p>CTF is over. Thanks for playing!</p>}
            </section>

            <section style={{ display: 'flex', justifyContent: 'center' }}>
                <img src="neko.png" alt="" />
            </section>

            <h2>[ About ]</h2>
            <section>
                Welcome to CakeCTF 2021!
                CakeCTF 2021 is a Jeopardy-style Capture The Flag competition hosted by yoshiking, theoremoon, and ptr-yudai.
                There will be some challenges of pwn, web, rev, crypto, and so on.
                These challenges range in difficulty from beginner to intermediate level.
            </section>

            <h2>[ Task Release Schedule ]</h2>
            <section>
                <p>We announce the schedule of the challenge release in <a href="https://discord.gg/mKbt7vje" target="_blank" rel="noreferrer">Discord</a>.</p>
                <ul>
                    <li>1st wave: 2021-08-28 08:00:00 JST (UTC+9)</li>
                    <li>2nd wave: 2021-08-28 14:00:00 JST (UTC+9)</li>
                    <li>3rd wave: 2021-08-28 20:00:00 JST (UTC+9)</li>
                </ul>
            </section>

            <h2>[ Prize ]</h2>
            <section>
                <p>
                    The following teams can get some small gifts this year.
                    <ul>
                        <li>Top 3 prize-eligible teams on the scoreboard (Swag &times; 4)</li>
                        <li>Prize-eligible teams that got first-blood on some specific challenges (Swag &times; 1)</li>
                    </ul>
                    4 challenges from each main category (crypto, pwn, web, rev) will be subject to the first-blood prize.
                    We&#39;ll announce which challenges you can get the first-blood prize in <a href="https://discord.gg/mKbt7vje" target="_blank" rel="noreferrer">Discord</a> before the CTF starts.<br />
                    As we cannot send the prize abroad, at least one of your team members needs to live in Japan to be eligible.
                </p>
                <p>
                    今年はささやかな賞品を用意しています。以下のチームが対象です。
                    <ul>
                        <li>(賞品を受け取れる)上位3チーム (Prizeセット &times; 4)</li>
                        <li>特定の問題を最初に解いた(賞品を受け取れる)チーム (First-Blood Prizeセット &times; 1)</li>
                    </ul>
                    メインカテゴリ（crypto, pwn, web, rev）の4つの問題がFirst-Blood Prizeの対象になります。
                    どの問題がFirst-Blood Prizeの対象かは、CTFが始まる前にDiscord上で連絡します。<br />
                    海外への賞品発送には対応していないので、賞品を受け取るにはチームメンバーの少なくとも1人が日本に居住している必要があります。
                </p>
            </section>

            <h2>[ Sponsors ]</h2>
            <section>
                <p>We&#39;d like to thank the following people for their financial support in organizing this event!</p>
                <ul>
                    <li>3socha</li>
                    <li>kusano_k</li>
                    <li>rkm0959</li>
                    <li>prof_siba</li>
                    <li>匿名希望</li>
                </ul>
            </section>

            <h2>[ Contact ]</h2>
            <section>
                <p>Discord: <a href="https://discord.gg/mKbt7vje" target="_blank" rel="noreferrer">https://discord.gg/mKbt7vje</a></p>
            </section>

            <h2>[ Rules ]</h2>
            <section>
                <ul>
                    <li>There is no limit on your team size.</li>
                    <li>Anyone can participate in this CTF: No restriction on your age, nationality, or the editor you use.</li>
                    <li>Your position on the scoreboard is decided by:
                        <ol>
                            <li>The total points (Higher is better)</li>
                            <li>The timestamp of your last submission (Earlier is better)</li>
                        </ol>
                    </li>
                    <li>The survey challenge is special: It gives you some points but it doesn&#39;t update your &quot;submission timestamp&quot;. You can&#39;t get ahead simply by solving the survey faster. Take enough time to fill the survey.</li>
                    <li>You can&#39;t brute-force the flag. If you submit 5 incorrect flags in a short period of time, the submission form will be locked for 5 minutes.</li>
                    <li>You can&#39;t participate in multiple teams.</li>
                    <li>Sharing the solutions, hints or flags with other teams during the competition is strictly forbidden.</li>
                    <li>You are not allowed to attack the scoreserver.</li>
                    <li>You are not allowed to attack the other teams.</li>
                    <li>You are not allowed to have multiple accounts. If you can&#39;t log in to your account, use the password reset form or contact us on Discord.</li>
                    <li>We may ban and disqualify any teams that break any of these rules.</li>
                    <li>The flag format is <code>CakeCTF\{'{'}[\x20-\x7e]+\{'}'}</code> unless specified otherwise.</li>
                    <li>Most importantly: good luck and have fun!</li>
                </ul>
            </section>
        </>
    )
}

export default Index;

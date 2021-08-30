import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

type Props = {}

class Document extends NextDocument<Props> {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="description" content="2021-08-28 08:00:00 +09:00 – 2021-08-29 20:00:00 +09:0"></meta>

                    <meta property="og:url" content="https://2021.cakectf.com/"></meta>
                    <meta property="og:type" content="website"></meta>
                    <meta property="og:title" content="CakeCTF 2021"></meta>
                    <meta property="og:description" content="2021-08-28 08:00:00 +09:00 – 2021-08-29 20:00:00 +09:0"></meta>
                    <meta property="og:image" content="https://2021.cakectf.com/neko.png"></meta>

                    <meta name="twitter:card" content="summary_large_image"></meta>
                    <meta property="twitter:domain" content="2021.cakectf.com"></meta>
                    <meta property="twitter:url" content="https://2021.cakectf.com/"></meta>
                    <meta name="twitter:title" content="CakeCTF 2021"></meta>
                    <meta name="twitter:description" content="2021-08-28 08:00:00 +09:00 – 2021-08-29 20:00:00 +09:0"></meta>
                    <meta name="twitter:image" content="https://2021.cakectf.com/neko.png"></meta>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default Document
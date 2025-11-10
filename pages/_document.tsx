import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Prepkitty is an AI-powered platform that helps you practice for your job interviews. Get instant feedback and improve your skills." />
        <meta name="keywords" content="interview practice, AI interview, mock interview, job interview, career, prepkitty" />
        <meta property="og:title" content="Prepkitty - AI Interview Practice" />
        <meta property="og:description" content="Prepkitty is an AI-powered platform that helps you practice for your job interviews. Get instant feedback and improve your skills." />
        <meta property="og:image" content="/prepkitty_logo.png" />
        <meta property="og:url" content="https://prepkitty.co" />
        <meta name="twitter:card" content="/prepkitty_logo.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

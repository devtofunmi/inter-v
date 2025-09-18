import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    AOS.init({
      once: false, // Animation happens every time on scroll
      mirror: true, // Animate out when scrolling past
      duration: 800,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

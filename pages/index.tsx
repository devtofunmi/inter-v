
import Head from "next/head";
import {
  Header,
  Hero,
  Features,
  // Testimonials,
  // Pricing,
  Faq,
  CTA,
  Footer,
} from "../components/landingpage";

export default function Home() {
  return (
    <div className="font-geist bg-white text-gray-900 text-[17px] font-normal">
      <Head>
        <title>Prepkitty - AI Interview Practice</title>
      </Head>
      <Header />
      <Hero />
      <Features />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Faq />
      <CTA />
      <Footer />
    </div>
  );
}

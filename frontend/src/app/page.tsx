import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Benefits } from "@/components/sections/Benefits";
import { Demo } from "@/components/sections/Demo";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Cases } from "@/components/sections/Cases";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Benefits />
        <Demo />
        <Services />
        <Process />
        <Cases />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

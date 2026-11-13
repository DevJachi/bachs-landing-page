import PageLines from "@/components/sections/PageLines";
import AnnounceBar from "@/components/sections/AnnounceBar";
import SiteNav from "@/components/sections/SiteNav";
import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import LogoStrip from "@/components/sections/LogoStrip";
import GapStatement from "@/components/sections/GapStatement";
import WhyBachs from "@/components/sections/WhyBachs";
import Platform from "@/components/sections/Platform";
import Features from "@/components/sections/Features";
import Sdk from "@/components/sections/Sdk";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import SiteFooter from "@/components/sections/SiteFooter";
import SiteScripts from "@/components/SiteScripts";

export default function Home() {
  return (
    <>
      <PageLines />
      <AnnounceBar />
      <SiteNav />
      <main>
        <Hero />
        <Showcase />
        <LogoStrip />
        <GapStatement />
        <WhyBachs />
        <Platform />
        <Features />
        <Sdk />
        <Testimonials />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
      <SiteScripts />
    </>
  );
}

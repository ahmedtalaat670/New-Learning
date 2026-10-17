import Link from "next/link";
import { Button } from "./animate-ui/components/buttons/button";
import { BlurFade } from "./ui/blur-fade";

export default function Hero() {
  return (
    <section className="flex min-h-150 items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <BlurFade direction="right">
          <h1 className=" font-semibold tracking-tight text-foreground text-3xl sm:text-[48px]">
            <span className="text-primary">Unlock</span> Your Creative Potential
          </h1>
        </BlurFade>
        <BlurFade direction="left" delay={0.4}>
          <p className="mt-6 font-medium text-[#1a1a1a] text-2xl sm:text-[38px]">
            with Online Design and Development Courses.
          </p>
        </BlurFade>
        <BlurFade direction="right" delay={0.8}>
          <p className="mt-4 text-base text-muted-foreground sm:text-[18px]">
            Learn from Industry Experts and Enhance Your Skills.
          </p>
        </BlurFade>

        <div className="mt-8 flex justify-center">
          <BlurFade direction="down" delay={1.2}>
            <Button
              size="lg"
              className="bg-primary px-8 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

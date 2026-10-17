import Image from "next/image";
import { BlurFade } from "./ui/blur-fade";
import { Marquee } from "./ui/marquee";

const logos = [
  { name: "Zapier", src: "/zapier.png" },
  { name: "Spotify", src: "/spotify.png" },
  { name: "Zoom", src: "/zoom.png" },
  { name: "Amazon", src: "/amazon.png" },
  { name: "Adobe", src: "/adobe.png" },
  { name: "Notion", src: "/notion.png" },
  { name: "Netflix", src: "/netflix.png" },
];

export default function LogoBar() {
  return (
    <BlurFade direction="down" delay={1.6}>
      <section className="w-full">
        <div className="mx-auto bg-white flex min-h-24 max-w-7xl items-center justify-between sm:mx-6 lg:mx-8">
          <Marquee reverse pauseOnHover>
            {logos.map((logo) => (
              <div
                key={logo.name}
                className={`flex items-center justify-center ${logo.name === "Zapier" ? "pl-15" : ""}`}
              >
                <Image
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-9"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </BlurFade>
  );
}

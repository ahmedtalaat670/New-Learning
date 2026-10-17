import { BlurFade } from "./ui/blur-fade";

const benefits = [
  {
    number: "01",
    title: "Flexible Learning Schedule",
    description:
      "Fit your coursework around your existing commitments and obligations.",
  },
  {
    number: "02",
    title: "Expert Instructors",
    description:
      "Learn from experienced professionals who provide practical knowledge and industry insights.",
  },
  {
    number: "03",
    title: "Diverse Course Selection",
    description:
      "Explore a wide range of courses designed to help you develop valuable skills.",
  },
  {
    number: "04",
    title: "Interactive Learning",
    description:
      "Engage with practical lessons and activities that make learning more effective and enjoyable.",
  },
  {
    number: "05",
    title: "Progress Tracking",
    description:
      "Monitor your learning progress and stay motivated as you work toward your goals.",
  },
  {
    number: "06",
    title: "Affordable Learning",
    description:
      "Access high-quality educational content at an affordable price that fits your budget.",
  },
];

export default function Benefits() {
  return (
    <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Text Container */}
        <BlurFade inView>
          <div className="w-full">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Benefits
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam
              eget elit id imperdiet et. Cras eu sit dignissim lorem nibh et. Ac
              cum eget habitasse in velit fringilla feugiat senectus in.
            </p>
          </div>
        </BlurFade>

        {/* Benefits Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <BlurFade key={benefit.number} inView>
              <article className="rounded-xl border h-75 bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {/* Number */}
                <div className="flex justify-end">
                  <span className="text-5xl font-bold tracking-tight text-foreground/10">
                    {benefit.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 leading-7 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

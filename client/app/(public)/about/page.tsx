import { BlurFade } from "@/components/ui/blur-fade";
import {
  Award,
  GraduationCap,
  Users,
  Trophy,
  Accessibility,
  BookOpen,
  Lightbulb,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SkillBridge's mission to empower students and instructors worldwide through high-quality, accessible online education.",
  keywords: [
    "about coursehub",
    "online education platform",
    "our mission",
    "e-learning team",
    "instructor platform",
  ],
  openGraph: {
    title: "About Us | SkillBridge",
    description:
      "Discover our mission, values, and the team driving high-quality online education for students and instructors worldwide.",
    type: "website",
  },
};

const achievements: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Users,
    title: "Trusted by Thousands",
    description:
      "We have successfully served thousands of students, helping them unlock their potential and achieve their career goals.",
  },
  {
    icon: GraduationCap,
    title: "Expert-Led Learning",
    description:
      "Our courses are created and delivered by experienced professionals who bring real-world knowledge to every lesson.",
  },
  {
    icon: Award,
    title: "Quality Education",
    description:
      "We are committed to providing high-quality educational content that helps learners develop practical and valuable skills.",
  },
  {
    icon: Trophy,
    title: "Successful Outcomes",
    description:
      "Our learners have achieved meaningful results by applying the skills and knowledge gained through our platform.",
  },
];

const goals: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Accessibility,
    title: "Accessible Education",
    description:
      "Make high-quality design and development education accessible to learners from all backgrounds and experience levels.",
  },
  {
    icon: BookOpen,
    title: "Practical Learning",
    description:
      "Provide carefully crafted courses that focus on practical skills and real-world knowledge learners can apply immediately.",
  },
  {
    icon: Lightbulb,
    title: "Empower Creativity",
    description:
      "Encourage learners to explore their creativity, develop innovative ideas, and turn their passion into meaningful opportunities.",
  },
  {
    icon: Target,
    title: "Career Growth",
    description:
      "Equip learners with the skills and confidence they need to achieve their career goals and make a meaningful impact in the digital world.",
  },
];

export default function About() {
  return (
    <>
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:gap-16">
          {/* Heading */}
          <div className="shrink-0 md:w-1/3">
            <BlurFade direction="right">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                About Skillbridge
              </h2>
            </BlurFade>
          </div>

          {/* Paragraph */}
          <div className="md:w-2/3">
            <BlurFade direction="left">
              <p className="leading-7 text-muted-foreground sm:text-lg">
                Welcome to our platform, where we are passionate about
                empowering individuals to master the world of design and
                development. We offer a wide range of online courses designed to
                equip learners with the skills and knowledge needed to succeed
                in the ever-evolving digital landscape.
              </p>
            </BlurFade>
          </div>
        </div>
      </section>
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Text Container */}
          <div className="w-full">
            <BlurFade direction="down" inView>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Achievements
              </h2>
            </BlurFade>

            <BlurFade direction="down" inView>
              <p className="mt-4 leading-7 text-muted-foreground sm:text-lg lg:w-4/5">
                Our commitment to excellence has led us to achieve significant
                milestones along our journey. Here are some of our notable
                achievements.
              </p>
            </BlurFade>
          </div>

          {/* Achievement Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;

              return (
                <BlurFade key={achievement.title} direction="down" inView>
                  <article className="rounded-xl h-65 border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-foreground">
                        {achievement.title}
                      </h3>

                      <p className="mt-3 leading-7 text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </article>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Text Container */}
          <div className="w-full">
            <BlurFade direction="down" inView>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Goals
              </h2>
            </BlurFade>

            <BlurFade direction="down" inView>
              <p className="mt-4 leading-7 text-muted-foreground sm:text-lg lg:w-4/5">
                At SkillBridge, our goal is to empower individuals from all
                backgrounds to thrive in the world of design and development. We
                believe that education should be accessible and transformative,
                enabling learners to pursue their passions and make a meaningful
                impact. Through our carefully crafted courses, we aim to provide
                the knowledge, skills, and confidence learners need to succeed.
              </p>
            </BlurFade>
          </div>

          {/* Goal Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {goals.map((goal) => {
              const Icon = goal.icon;

              return (
                <BlurFade key={goal.title} direction="down" inView>
                  <article className="rounded-xl h-65 border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-foreground">
                        {goal.title}
                      </h3>

                      <p className="mt-3 leading-7 text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                  </article>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "./ui/blur-fade";

const faqs = [
  {
    question: "Can I enroll in multiple courses at once?",
    answer:
      "Yes. You can enroll in multiple courses at the same time. Simply choose the courses you are interested in and complete the enrollment process for each one.",
  },
  {
    question: "Enrollment Process for Different Courses",
    answer:
      "You can browse our available courses, select the course you want, and follow the enrollment instructions on its course page. Each course can be purchased and accessed independently.",
  },
  {
    question: "What kind of support can I expect from instructors?",
    answer:
      "Our instructors provide guidance throughout your learning journey. Depending on the course, support may include answering questions, providing feedback, explaining difficult topics, and offering additional learning resources.",
  },
  {
    question:
      "Are the courses self-paced or do they have specific start and end dates?",
    answer:
      "Most of our courses are self-paced, allowing you to learn whenever it is convenient for you. Some courses or special programs may have specific schedules, which will be clearly stated on the course page.",
  },
  {
    question: "Are there any prerequisites for the courses?",
    answer:
      "Prerequisites vary depending on the course. Any required prior knowledge, skills, or experience will be clearly mentioned on the course details page before you enroll.",
  },
  {
    question: "Can I download the course materials for offline access?",
    answer:
      "If offline access is available for a course, the downloadable materials will be provided through the course platform. Availability may vary depending on the course and the type of content.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white py-20 mx-auto sm:mx-6 lg:mx-8 rounded-md">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Header */}
        <BlurFade direction="right" inView>
          <div className="ml-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              Still you have any questions? Contact our Team via{" "}
              <Link
                href="mailto:support@skillbridge.com"
                className="font-medium text-primary transition-colors hover:underline"
              >
                support@skillbridge.com
              </Link>
            </p>
          </div>
        </BlurFade>

        {/* Questions */}
        <BlurFade direction="left" inView>
          <div className="mx-4">
            <Accordion className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="border-b"
                >
                  <AccordionTrigger className="py-6 text-left text-base font-semibold hover:no-underline sm:text-lg">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="pb-6 leading-7 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

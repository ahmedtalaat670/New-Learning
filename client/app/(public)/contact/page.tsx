import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../../../components/animate-ui/components/buttons/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the SkillBridge support team. Have questions about courses, teaching, or account support? We are here to help.",
  keywords: [
    "contact skillbridge",
    "customer support",
    "course help",
    "instructor inquiry",
    "skillbridge contact",
  ],
  openGraph: {
    title: "Contact Us | SkillBridge",
    description:
      "Have questions or need assistance? Reach out to the SkillBridge team today.",
    type: "website",
  },
};

const contactInfo = [
  {
    value: "support@skillbridge.com",
    href: "mailto:support@skillbridge.com",
    icon: Mail,
  },
  {
    value: "Egypt",
    icon: MapPin,
  },
  {
    value: "+90000000000",
    href: "tel:+90000000000",
    icon: Phone,
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: SiFacebook,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: SiX,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: SiInstagram,
  },
];

const formFields = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "Enter your first name",
    type: "text",
  },
  {
    id: "lastName",
    label: "Last Name",
    placeholder: "Enter your last name",
    type: "text",
  },
  {
    id: "phone",
    label: "Phone",
    placeholder: "+20 000 000 0000",
    type: "tel",
  },
  {
    id: "email",
    label: "Email",
    placeholder: "example@email.com",
    type: "email",
  },
];

export default function Contact() {
  return (
    <>
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          {/* Heading */}
          <div className="shrink-0 md:w-1/3">
            <BlurFade direction="right">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Contact Us
              </h2>
            </BlurFade>
          </div>

          {/* Paragraph */}
          <div className="md:w-2/3">
            <BlurFade direction="left">
              <p className="leading-7 text-muted-foreground">
                Welcome to SkillBridge's Pricing Plan page, where we offer two
                comprehensive options to cater to your needs: Free and Pro. We
                believe in providing flexible and affordable pricing options for
                our services. Whether you're an individual looking to enhance
                your skills or a business seeking professional development
                solutions, we have a plan that suits you. Explore our pricing
                options below and choose the one that best fits your
                requirements.
              </p>
            </BlurFade>
          </div>
        </div>
      </section>
      <BlurFade direction="down">
        <section className="bg-background mx-auto py-16 sm:mx-6 lg:mx-8 rounded-md">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_1fr]">
            {/* Form */}
            <div className="rounded-xl bg-white p-6 sm:p-8 lg:p-10">
              <form className="space-y-6">
                {/* First Name / Last Name / Phone / Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {formFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                      </label>

                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="px-2 py-5 bg-gray-50"
                      />
                    </div>
                  ))}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>

                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter the subject"
                    className="px-2 py-5 bg-gray-50"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>

                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message..."
                    className="min-h-40 resize-none bg-gray-50"
                  />
                </div>

                <div className="w-full flex justify-center">
                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary/90 px-4 py-6 cursor-pointer"
                  >
                    Send Your Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-6">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;

                return (
                  <div
                    key={contact.value}
                    className="flex flex-col items-center rounded-xl bg-gray-50 p-8 text-center"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    {contact.href ? (
                      <Link
                        href={contact.href}
                        className="mt-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {contact.value}
                      </Link>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {contact.value}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Social Media */}
              <div className="flex flex-col items-center rounded-xl bg-gray-50 p-8 text-center">
                <h3 className="font-semibold">Follow Us</h3>

                <div className="mt-4 flex items-center gap-10">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
                      >
                        <Icon size={18} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </BlurFade>
    </>
  );
}

import ContactForm from "@/components/ContactForm";
import { Accent, Container, Eyebrow, SectionTitle, SocialLinks } from "@/components/ui";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <section id="contact" className="bg-surface-alt py-20 xl:py-25">
      <Container>
        <div className="text-center">
          <div className="inline-block">
            <Eyebrow center>Contact Me</Eyebrow>
          </div>
          <SectionTitle>
            Let’s Talk for <Accent>Your Next Project</Accent>
          </SectionTitle>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.55fr_1fr] xl:mt-11">
          <ContactForm />

          <div className="overflow-hidden rounded-[22px]">
            <div className="bg-ink px-8 pb-9.5 pt-8.5">
              <h3 className="font-display text-[22px] font-bold text-accent">
                Location
              </h3>
              <p className="mt-3 font-sans text-[17px] leading-[1.6] text-on-dark2">
                Addis Ababa,
                <br />
                Ethiopia
              </p>

              <h3 className="mt-7.5 font-display text-[22px] font-bold text-accent">
                Contact
              </h3>
              <div className="mt-3 font-sans text-[17px] leading-[1.8] text-on-dark2">
                <p>
                  Email&nbsp;:{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-on-dark2 underline-offset-4 hover:underline"
                  >
                    {site.email}
                  </a>
                </p>
                <p>
                  LeetCode :{" "}
                  <a
                    href={site.leetcode}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-on-dark2 underline-offset-4 hover:underline"
                  >
                    {site.leetcodeHandle}
                  </a>
                </p>
              </div>

              <h3 className="mt-7.5 font-display text-[22px] font-bold text-accent">
                Availability
              </h3>
              <div className="mt-3 font-sans text-[17px] leading-[1.8] text-on-dark2">
                <p>Monday – Friday&nbsp;: 09:00 – 20:00</p>
                <p>Saturday – Sunday : 11:00 – 18:00</p>
              </div>
            </div>

            <div className="bg-accent px-8 pb-8 pt-7">
              <h3 className="font-display text-[22px] font-bold text-white">
                Stay Connected
              </h3>
              <SocialLinks tone="white" size={46} className="mt-4" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

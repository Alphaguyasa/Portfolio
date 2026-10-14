import SubscribeField from "@/components/SubscribeField";
import { Accent, Container, CtaPill, Logo, SocialLinks } from "@/components/ui";
import { footerNav, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-surface pt-14">
      <Container>
        <div className="flex flex-col gap-6 border-b border-hairline pb-8.5 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <h2 className="font-display text-[30px] font-bold tracking-[-0.6px] sm:text-4xl xl:text-[46px] xl:tracking-[-1.2px]">
            Let’s <Accent>Connect</Accent> there
          </h2>
          <CtaPill
            href={`mailto:${site.email}`}
            label="Contact Me"
            className="self-start"
          />
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.2fr] xl:pb-12">
          <div>
            <Logo />
            <p className="mt-4.5 max-w-[330px] font-sans text-base leading-[1.6] text-muted xl:text-[17px]">
              Full stack engineer in Addis Ababa. Offline-first systems, Android
              apps, and AI retrieval that cites its sources.
            </p>
            <SocialLinks
              tone="accent"
              size={42}
              iconSize={18}
              includeEmail={false}
              className="mt-5.5"
            />
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-xl font-bold text-accent">
              Navigation
            </h2>
            <ul className="mt-4.5 flex flex-col gap-3.5 font-sans text-base xl:text-[17px]">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted2 transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xl font-bold text-accent">
              Contact
            </h2>
            <ul className="mt-4.5 flex flex-col gap-3.5 font-sans text-base xl:text-[17px]">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-muted2 transition-colors duration-200 hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted2 transition-colors duration-200 hover:text-accent"
                >
                  github.com/Alphaguyasa
                </a>
              </li>
              <li>
                <a
                  href={site.leetcode}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all text-muted2 transition-colors duration-200 hover:text-accent"
                >
                  leetcode.com/u/{site.leetcodeHandle}
                </a>
              </li>
              <li className="text-muted2">{site.location}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-accent">
              Get the latest information
            </h2>
            <SubscribeField />
          </div>
        </div>
      </Container>

      <div className="bg-ink py-5.5">
        <Container className="flex flex-col items-center gap-2 text-center font-sans text-base text-bar-text sm:flex-row sm:justify-between sm:text-left">
          <p>
            Copyright © 2026 <span className="text-accent-bright">Alpha Guyasa.</span>{" "}
            All Rights Reserved.
          </p>
          <p>Built in Addis Ababa</p>
        </Container>
      </div>
    </footer>
  );
}

import { ArrowUpRight, Check } from "@/components/icons";
import { Accent, Container, CtaPill, Eyebrow, SectionTitle } from "@/components/ui";
import { pricingFeatures, pricingTiers } from "@/data/site";

export default function Pricing() {
  return (
    <section className="bg-surface py-20 xl:py-25">
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
          <div>
            <Eyebrow>Pricing Table</Eyebrow>
            <SectionTitle>
              My <Accent>Pricing Model</Accent>
            </SectionTitle>
          </div>
          <CtaPill href="#contact" label="Get Started" className="self-start" />
        </div>

        <div className="mt-10 grid gap-6.5 sm:grid-cols-2 lg:grid-cols-3 xl:mt-11">
          {pricingTiers.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-3xl bg-surface-alt2 p-5.5"
            >
              <div className="rounded-2xl bg-accent px-6 py-6 text-white">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-[22px] font-semibold">
                    {tier.tier}
                  </h3>
                  <span className="flex size-10 items-center justify-center rounded-full bg-white text-accent">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
                <p className="mt-4 font-display text-4xl font-bold tracking-[-1px] xl:text-[46px]">
                  {tier.price}{" "}
                  <span className="font-sans text-lg font-normal">
                    {tier.unit}
                  </span>
                </p>
              </div>

              <ul className="flex flex-col gap-4 px-2 pb-2 pt-6.5">
                {pricingFeatures.map((feature, i) => {
                  const included = i < tier.included;
                  return (
                    <li
                      key={feature}
                      className={`flex items-center gap-3.5 font-sans text-base xl:text-[17px] ${
                        included ? "text-ink" : "text-bar-text"
                      }`}
                    >
                      <span
                        className={`flex size-5.5 shrink-0 items-center justify-center rounded-full text-white ${
                          included ? "bg-accent" : "bg-tick-off"
                        }`}
                      >
                        <Check size={12} />
                      </span>
                      {feature}
                      <span className="sr-only">
                        {included ? " — included" : " — not included"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

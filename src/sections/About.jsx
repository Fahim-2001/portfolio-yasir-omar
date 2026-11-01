import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import portfolioData, { isPlaceholder } from '../data/portfolio';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';

// Tailwind needs complete class names, so map the fact count to a column class.
const FACT_COLUMNS = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

export function About() {
  const { profile, about, experience, education, languages } = portfolioData;

  const currentJob = experience.find((exp) => exp.end === 'Present') || experience[0];
  const primaryEducation = education && education[0];
  const languagesFormatted = languages
    ? languages.map((lang) => `${lang.name} (${lang.level})`).join(', ')
    : null;

  const hasPhoto = !isPlaceholder(profile.photo);
  const hasLocation = !isPlaceholder(profile.location);
  const [lead, ...rest] = about;

  const facts = [
    { term: 'Current Role', value: currentJob ? currentJob.role : profile.role },
    currentJob?.company && { term: 'Company', value: currentJob.company },
    currentJob?.type && { term: 'Work Mode', value: currentJob.type },
    primaryEducation && { term: 'Education', value: primaryEducation.degree },
    languagesFormatted && { term: 'Languages', value: languagesFormatted },
    hasLocation && { term: 'Location', value: profile.location },
  ].filter(Boolean);

  return (
    <Section id="about">
      <SectionHeading eyebrow="01 / About" title="About Me" />

      {/* Editorial spread: lead paragraph on the left, the rest on the right */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {lead && (
          <Reveal className="lg:col-span-7">
            <p className="text-2xl font-medium leading-[1.4] tracking-[-0.02em] text-text lg:text-[1.85rem]">
              {lead}
            </p>
          </Reveal>
        )}

        <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:pt-1.5">
          {hasPhoto && (
            <Reveal variant="depth" className="w-full">
              <Card wrapperClassName="w-full max-w-xs" className="overflow-hidden p-0">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-[inherit] object-cover grayscale contrast-105"
                />
              </Card>
            </Reveal>
          )}

          {rest.map((paragraph, index) => (
            <Reveal key={index} delay={0.08 * (index + 1)}>
              <p className="text-base leading-relaxed text-text-muted sm:text-lg">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.25} className="mt-4">
            <Button variant="outline" size="md" href="#contact">
              <span>Get in touch</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Quick facts: one spec row across the section */}
      <Reveal variant="depth" className="mt-20 md:mt-24">
        <Card layers={2} className="p-6 md:p-8">
          <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">// Quick Facts</h3>
          <dl
            className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 ${
              FACT_COLUMNS[facts.length] ?? 'lg:grid-cols-3'
            }`}
          >
            {facts.map(({ term, value }, i) => (
              <div
                key={term}
                className="relative bg-surface p-5 sm:[&:last-child:nth-child(odd)]:col-span-2 lg:[&:last-child:nth-child(odd)]:col-span-1"
              >
                <dt className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  <span>{term}</span>
                  <span aria-hidden="true" className="tracking-normal">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </dt>
                <dd className="mt-3 text-sm font-semibold leading-snug text-text sm:text-base">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </Reveal>
    </Section>
  );
}

export default About;

import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import portfolioData, { isPlaceholder } from '../data/portfolio';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';

export function About() {
  const { profile, about, experience, education, languages } = portfolioData;

  // Derive current position strictly from data file
  const currentJob = experience.find((exp) => exp.end === 'Present') || experience[0];
  const primaryEducation = education && education[0];
  const languagesFormatted = languages
    ? languages.map((lang) => `${lang.name} (${lang.level})`).join(', ')
    : null;

  const hasPhoto = !isPlaceholder(profile.photo);
  const hasLocation = !isPlaceholder(profile.location);

  return (
    <Section id="about">
      <Reveal>
        <SectionHeading eyebrow="01 / About" title="About Me" />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: About Paragraphs + Get In Touch Button */}
        <Reveal delay={0.1} className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="space-y-6 max-w-[65ch]">
            {about.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? 'text-lg sm:text-xl text-text leading-relaxed font-normal'
                    : 'text-base sm:text-lg text-text-muted leading-relaxed font-normal'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Button variant="outline" size="md" href="#contact">
            <span>Get in touch</span>
            <ArrowDownRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-200" />
          </Button>
        </Reveal>

        {/* Right Column: Photo (if present) & Quick Facts Card */}
        <Reveal delay={0.2} className="lg:col-span-5 w-full flex flex-col gap-8">
          {/* Photo Frame with offset box behind (rendered only if photo exists) */}
          {hasPhoto && (
            <div className="relative w-full max-w-xs mx-auto lg:mx-0 group">
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-border bg-surface-subtle -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"
                aria-hidden="true"
              />
              <div className="relative rounded-2xl border border-border overflow-hidden bg-surface aspect-[4/5]">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>
            </div>
          )}

          {/* Quick Facts Card */}
          <Card hover={false} className="p-6 md:p-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-6 pb-3 border-b border-border">
              // Quick Facts
            </h3>

            <dl className="space-y-4 text-sm">
              {/* Current Role */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                <dt className="font-mono text-xs text-text-muted">Current Role</dt>
                <dd className="font-medium text-text text-left sm:text-right">
                  {currentJob ? currentJob.role : profile.role}
                </dd>
              </div>

              {/* Company */}
              {currentJob?.company && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pt-3.5 border-t border-border">
                  <dt className="font-mono text-xs text-text-muted">Company</dt>
                  <dd className="font-medium text-text text-left sm:text-right">
                    {currentJob.company}
                  </dd>
                </div>
              )}

              {/* Work Mode */}
              {currentJob?.type && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pt-3.5 border-t border-border">
                  <dt className="font-mono text-xs text-text-muted">Work Mode</dt>
                  <dd className="font-medium text-text text-left sm:text-right">
                    {currentJob.type}
                  </dd>
                </div>
              )}

              {/* Education */}
              {primaryEducation && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pt-3.5 border-t border-border">
                  <dt className="font-mono text-xs text-text-muted">Education</dt>
                  <dd className="font-medium text-text text-left sm:text-right">
                    {primaryEducation.degree}
                  </dd>
                </div>
              )}

              {/* Languages */}
              {languagesFormatted && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pt-3.5 border-t border-border">
                  <dt className="font-mono text-xs text-text-muted">Languages</dt>
                  <dd className="font-medium text-text text-left sm:text-right">
                    {languagesFormatted}
                  </dd>
                </div>
              )}

              {/* Location: Hidden if null */}
              {hasLocation && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pt-3.5 border-t border-border">
                  <dt className="font-mono text-xs text-text-muted">Location</dt>
                  <dd className="font-medium text-text text-left sm:text-right">
                    {profile.location}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

export default About;

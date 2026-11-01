import React from 'react';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Reveal } from '../components/Reveal';
import portfolioData from '../data/portfolio';

export function Education() {
  const educationList = portfolioData.education;
  const languagesList = portfolioData.languages;

  return (
    <Section id="education">
      <SectionHeading
        eyebrow="06 / Education"
        title="Education"
        subtitle="Academic background, coursework, and languages"
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          {educationList.map((edu) => (
            <Reveal key={edu.degree} variant="depth">
              <Card tilt maxTilt={3} layers={2} className="p-7 sm:p-10">
                <span className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                  // Degree Program
                </span>
                <h3 className="mb-2 text-2xl font-black leading-tight tracking-[-0.03em] text-text sm:text-3xl">
                  {edu.degree}
                </h3>
                <p className="text-base leading-relaxed text-text-muted">{edu.institution}</p>

                {/* Spec row */}
                <dl className="mt-8 grid grid-cols-2 border-y border-border">
                  <div className="border-r border-border py-5 pr-5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">CGPA</dt>
                    <dd className="extrude mt-2 font-mono text-4xl font-semibold tracking-tight text-text sm:text-5xl">
                      {edu.cgpa}
                    </dd>
                  </div>
                  <div className="py-5 pl-5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Graduated</dt>
                    <dd className="mt-3 text-lg font-semibold tracking-tight text-text sm:text-xl">{edu.graduation}</dd>
                  </div>
                </dl>

                <div className="pt-7">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">// Key Coursework</span>
                    <span className="font-mono text-[11px] text-text-muted">{edu.courses.length} courses</span>
                  </div>

                  <ol className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                    {edu.courses.map((course, i) => (
                      <li
                        key={course}
                        className="group flex items-baseline gap-3 border-b border-border py-2.5 text-sm text-text"
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-mono text-[11px] text-text-muted transition-colors group-hover:text-text"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-snug transition-transform duration-300 group-hover:translate-x-1">
                          {course}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal variant="depth" delay={0.12} className="lg:col-span-4">
          <Card className="p-6 sm:p-8">
            <div className="mb-6 border-b border-border pb-4">
              <span className="mb-1 block font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                // Communication
              </span>
              <h3 className="text-lg font-bold tracking-tight text-text">Languages</h3>
            </div>

            <ul className="space-y-3">
              {languagesList.map((lang) => (
                <li
                  key={lang.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-bg p-3.5 shadow-[0_3px_0_0_var(--border)]"
                >
                  <span className="text-sm font-medium text-text">{lang.name}</span>
                  <Tag strong>{lang.level}</Tag>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

export default Education;

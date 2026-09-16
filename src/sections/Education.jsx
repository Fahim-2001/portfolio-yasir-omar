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
    <Section id="education" className="py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="06 / Education"
          title="Education"
          subtitle="Academic background, coursework, and languages"
        />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto items-start">
        {/* Main Education Card (8 cols on desktop) */}
        <Reveal delay={0.1} className="lg:col-span-8 space-y-6">
          {educationList.map((edu, idx) => (
            <Card key={idx} className="p-8 sm:p-10">
              <div className="flex flex-col gap-6">
                {/* Header: Degree & Institution */}
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-2">
                    // Degree Program
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text mb-2">
                    {edu.degree}
                  </h3>
                  <p className="text-base text-text-muted leading-relaxed">
                    {edu.institution}
                  </p>
                </div>

                {/* Tags row: CGPA & Graduation */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Tag className="text-xs px-3 py-1 font-semibold text-text border-text/30 bg-bg">
                    CGPA {edu.cgpa}
                  </Tag>
                  <Tag className="text-xs px-3 py-1 font-mono text-text-muted border-border bg-bg">
                    Graduated {edu.graduation}
                  </Tag>
                </div>

                {/* Coursework list */}
                <div className="pt-6 border-t border-border/70">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                      // Key Coursework
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      {edu.courses.length} courses
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {edu.courses.map((course) => (
                      <div
                        key={course}
                        className="flex items-start gap-2 text-xs sm:text-sm font-mono text-text/90 group"
                      >
                        <span className="text-text-muted select-none group-hover:text-text transition-colors">
                          —
                        </span>
                        <span className="leading-snug">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Reveal>

        {/* Languages Card (4 cols on desktop) */}
        <Reveal delay={0.2} className="lg:col-span-4">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/70">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-1">
                  // Communication
                </span>
                <h3 className="text-lg font-bold text-text tracking-tight">
                  Languages
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {languagesList.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-bg/50"
                >
                  <span className="font-medium text-sm text-text">
                    {lang.name}
                  </span>
                  <Tag className="text-[11px] font-mono px-2.5 py-0.5 text-text border-border bg-surface">
                    {lang.level}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

export default Education;

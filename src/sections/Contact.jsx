import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Copy, Check, ArrowUpRight, FileText, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import portfolioData from '../data/portfolio';

export function Contact() {
  const { profile } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let success = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(profile.email);
        success = true;
      } catch {
        // Fall back to execCommand below
      }
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = profile.email;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <Section id="contact" className="py-20 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="07 / Contact"
          title="Let's Work Together"
          subtitle="I'm open to software engineering opportunities and collaborations. The fastest way to reach me is email."
        />
      </Reveal>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Main Hero Contact Card */}
        <Reveal delay={0.1}>
          <Card className="p-6 sm:p-10 md:p-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-2">
                // Direct Inbox
              </span>

              {/* Large Clickable Email with Animated Hover Underline & Integrated Copy Button */}
              <div className="my-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 md:p-8 rounded-2xl border border-border/80 bg-bg/50">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group relative inline-block text-[clamp(1.1rem,4.2vw,2rem)] font-mono font-bold tracking-tight text-text break-all sm:break-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded"
                    aria-label={`Send email to ${profile.email}`}
                  >
                    <span>{profile.email}</span>
                    {/* Animated monochrome underline */}
                    <span className="absolute left-0 bottom-0 w-full h-[2px] md:h-[3px] bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </a>

                  {/* Copy Button with Status Feedback */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy email address to clipboard"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-text hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text cursor-pointer select-none font-mono text-xs sm:text-sm shrink-0 self-start sm:self-auto"
                    title="Copy email to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-current" />
                        <span className="font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-current" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-text-muted text-sm sm:text-base leading-relaxed mt-2 max-w-2xl">
                Feel free to reach out directly regarding full-time engineering roles, distributed systems, or freelance cloud architectures.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-border/70">
                <Button
                  variant="primary"
                  size="md"
                  href={`mailto:${profile.email}`}
                  className="font-mono"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Send an Email</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  href={profile.resumeUrl}
                  external
                  download
                  className="font-mono"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Download Resume</span>
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Structured Contact Rows Card */}
        <Reveal delay={0.2}>
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                // Contact Channels & Profiles
              </span>
              <span className="font-mono text-[11px] text-text-muted">
                {profile.showPhone ? '4 channels' : '3 channels'}
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {/* Email Channel */}
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center justify-between py-4 group hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-2"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg border border-border bg-bg flex items-center justify-center text-text group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-colors">
                    <Mail className="w-4 h-4 text-current" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text block">
                      Email
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      {profile.email}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-text-muted group-hover:text-text flex items-center gap-1 transition-colors">
                  mailto <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>

              {/* GitHub Channel */}
              {profile.socials
                .filter((s) => s.label === 'GitHub')
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${profile.shortName}'s GitHub profile (opens in a new tab)`}
                    className="flex items-center justify-between py-4 group hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-2"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg border border-border bg-bg flex items-center justify-center text-text group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-colors">
                        <FaGithub className="w-4 h-4 text-current" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-text block">
                          GitHub
                        </span>
                        <span className="text-xs font-mono text-text-muted">
                          {social.url.replace('https://', '')}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-text-muted group-hover:text-text flex items-center gap-1 transition-colors">
                      visit <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                ))}

              {/* LinkedIn Channel */}
              {profile.socials
                .filter((s) => s.label === 'LinkedIn')
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with ${profile.shortName} on LinkedIn (opens in a new tab)`}
                    className="flex items-center justify-between py-4 group hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-2"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg border border-border bg-bg flex items-center justify-center text-text group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-colors">
                        <FaLinkedin className="w-4 h-4 text-current" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-text block">
                          LinkedIn
                        </span>
                        <span className="text-xs font-mono text-text-muted">
                          {social.url.replace('https://', '')}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-text-muted group-hover:text-text flex items-center gap-1 transition-colors">
                      connect <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                ))}

              {/* Phone Channel (rendered ONLY if profile.showPhone is true) */}
              {profile.showPhone && profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center justify-between py-4 group hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded px-2"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg border border-border bg-bg flex items-center justify-center text-text group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-colors">
                      <Phone className="w-4 h-4 text-current" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-text block">
                        Phone
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        {profile.phone}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-text-muted group-hover:text-text flex items-center gap-1 transition-colors">
                    call <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              )}
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

export default Contact;

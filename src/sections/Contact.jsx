import React, { useEffect, useRef, useState } from 'react';
import { Mail, Copy, Check, ArrowUpRight, FileText, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Reveal } from '../components/Reveal';
import { PerspectiveFloor } from '../components/PerspectiveFloor';
import portfolioData from '../data/portfolio';

function ChannelRow({ href, icon: Icon, title, detail, action, external = false, ariaLabel }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      className="group flex items-center justify-between gap-4 rounded-xl px-2 py-4 transition-colors"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-text shadow-[0_3px_0_0_var(--border)] transition-transform duration-200 group-hover:-translate-y-0.5">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-text">{title}</span>
          <span className="block truncate font-mono text-xs text-text-muted">{detail}</span>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-text-muted transition-colors group-hover:text-text">
        {action}
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

export function Contact() {
  const { profile } = portfolioData;
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

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
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2200);
    }
  };

  const github = profile.socials.find((s) => s.label === 'GitHub');
  const linkedin = profile.socials.find((s) => s.label === 'LinkedIn');
  const showPhone = profile.showPhone && profile.phone;
  const channelCount = 1 + (github ? 1 : 0) + (linkedin ? 1 : 0) + (showPhone ? 1 : 0);

  return (
    <Section id="contact" className="isolate overflow-hidden pb-40 md:pb-56 lg:pb-56">
      <PerspectiveFloor className="-z-10 h-[46%]" />

      <SectionHeading
        eyebrow="07 / Contact"
        title="Let's Work Together"
        subtitle="I'm open to software engineering opportunities and collaborations. The fastest way to reach me is email."
      />

      <div className="mx-auto max-w-5xl space-y-10">
        <Reveal variant="depth">
          <Card tilt maxTilt={3} layers={2} spotlight className="p-6 sm:p-10 md:p-12">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              // Direct Inbox
            </span>

            <div className="my-6 flex flex-col justify-between gap-5 rounded-2xl border border-border bg-bg p-5 shadow-[0_4px_0_0_var(--border)] sm:p-7 md:flex-row md:items-center md:p-8">
              <a
                href={`mailto:${profile.email}`}
                className="group relative inline-block min-w-0 break-all rounded font-mono text-[clamp(1.05rem,3.4vw,2rem)] font-semibold tracking-tight text-text sm:break-normal"
                aria-label={`Send email to ${profile.email}`}
              >
                <span>{profile.email}</span>
                <span aria-hidden="true" className="caret" />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-text transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy email address to clipboard"
                title="Copy email to clipboard"
                className="key key--outline key--sm shrink-0 self-start font-mono md:self-auto"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span className="font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
              Feel free to reach out directly regarding full-time engineering roles, distributed systems, or freelance cloud architectures.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-8">
              <Button variant="primary" size="md" href={`mailto:${profile.email}`} className="font-mono">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Send an Email</span>
              </Button>
              <Button variant="outline" size="md" href={profile.resumeUrl} external download className="font-mono">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Download Resume</span>
              </Button>
            </div>
          </Card>
        </Reveal>

        <Reveal variant="depth" delay={0.1}>
          <Card className="p-6 sm:p-8">
            <div className="mb-2 flex items-center justify-between border-b border-border pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                // Contact Channels & Profiles
              </span>
              <span className="font-mono text-[11px] text-text-muted">{channelCount} channels</span>
            </div>

            <div className="divide-y divide-border">
              <ChannelRow href={`mailto:${profile.email}`} icon={Mail} title="Email" detail={profile.email} action="mailto" />
              {github && (
                <ChannelRow
                  href={github.url}
                  icon={FaGithub}
                  title="GitHub"
                  detail={github.url.replace('https://', '')}
                  action="visit"
                  external
                  ariaLabel={`Visit ${profile.shortName}'s GitHub profile (opens in a new tab)`}
                />
              )}
              {linkedin && (
                <ChannelRow
                  href={linkedin.url}
                  icon={FaLinkedin}
                  title="LinkedIn"
                  detail={linkedin.url.replace('https://', '')}
                  action="connect"
                  external
                  ariaLabel={`Connect with ${profile.shortName} on LinkedIn (opens in a new tab)`}
                />
              )}
              {showPhone && (
                <ChannelRow href={`tel:${profile.phone}`} icon={Phone} title="Phone" detail={profile.phone} action="call" />
              )}
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

export default Contact;

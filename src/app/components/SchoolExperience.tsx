"use client";

import {
  ArrowRight,
  Atom,
  Blocks,
  BookHeart,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  GraduationCap,
  MapPin,
  Menu,
  MoveUpRight,
  Music2,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";

const CampusModel = dynamic(() => import("./CampusModel"), {
  ssr: false,
  loading: () => (
    <div className="campus-model-loading" role="status">
      <span />
      Building interactive campus…
    </div>
  ),
});

export type ProgramView = {
  id: number;
  slug: string;
  title: string;
  degree: string;
  description: string;
  duration: string;
  icon: string;
};

export type EventView = {
  id: number;
  slug: string;
  title: string;
  date: string;
  startTime: string;
  location: string;
  category: string;
};

type SchoolExperienceProps = {
  programs: ProgramView[];
  events: EventView[];
};

const iconMap: Record<string, LucideIcon> = {
  early: Blocks,
  primary: BookHeart,
  middle: Compass,
  secondary: GraduationCap,
  steam: Atom,
  arts: Music2,
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const dayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  timeZone: "UTC",
});

function formatEventDate(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  return {
    month: monthFormatter.format(value).toUpperCase(),
    day: dayFormatter.format(value),
  };
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}

function Logo() {
  return (
    <a href="#top" className="brand" aria-label="Horizon International School home">
      <span className="brand-mark" aria-hidden="true">
        <span>H</span>
      </span>
      <span className="brand-copy">
        <strong>HORIZON</strong>
        <small>INTERNATIONAL SCHOOL</small>
      </span>
    </a>
  );
}

function CampusScene() {
  const reducedMotion = useReducedMotion();
  const rotateXMotion = useMotionValue(0);
  const rotateYMotion = useMotionValue(0);
  const rotateX = useSpring(rotateXMotion, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(rotateYMotion, { stiffness: 120, damping: 22 });
  const glowX = useTransform(rotateY, [-9, 9], [35, 65]);
  const glowY = useTransform(rotateX, [-7, 7], [40, 60]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateYMotion.set(x * 14);
    rotateXMotion.set(y * -11);
  }

  function resetTilt() {
    rotateXMotion.set(0);
    rotateYMotion.set(0);
  }

  return (
    <div
      className="campus-stage"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      aria-label="Interactive view of Horizon International School"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <motion.div
        className="campus-card"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          backgroundImage:
            "linear-gradient(180deg, rgba(4,16,24,.02), rgba(4,16,24,.62)), url('https://images.pexels.com/photos/8926848/pexels-photo-8926848.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200')",
          backgroundPositionX: glowX,
          backgroundPositionY: glowY,
        }}
      >
        <div className="scene-topline" style={{ transform: "translateZ(44px)" }}>
          <span>VISIT OUR SCHOOL</span>
          <span className="live-dot">OPEN</span>
        </div>
        <div className="scene-play" style={{ transform: "translateZ(70px)" }}>
          <Play size={19} fill="currentColor" />
        </div>
        <div className="scene-caption" style={{ transform: "translateZ(62px)" }}>
          <span>WELCOME / 2026</span>
          <strong>A place to belong.<br />A world to discover.</strong>
        </div>
      </motion.div>

      <motion.div
        className="float-card float-card-top"
        animate={reducedMotion ? undefined : { y: [0, -10, 0], rotate: [-2, 1, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="mini-icon"><ShieldCheck size={18} /></span>
        <span><b>98%</b><small>family satisfaction</small></span>
      </motion.div>

      <motion.div
        className="float-card float-card-bottom"
        animate={reducedMotion ? undefined : { y: [0, 8, 0], rotate: [2, -1, 2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <div className="avatar-stack" aria-hidden="true">
          <span>AR</span><span>VK</span><span>SM</span>
        </div>
        <span><b>620</b><small>curious learners</small></span>
      </motion.div>
    </div>
  );
}

function AdmissionsForm({ programs }: { programs: ProgramView[] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to send request.");
      setStatus("success");
      setMessage(result.message || "Your request was sent.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form className="admissions-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Parent / guardian name *</span>
          <input name="name" type="text" autoComplete="name" placeholder="Your full name" minLength={2} required />
        </label>
        <label>
          <span>Parent email *</span>
          <input name="email" type="email" autoComplete="email" placeholder="parent@example.com" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Phone number</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
        </label>
        <label>
          <span>Entry stage *</span>
          <select name="program" defaultValue="" required>
            <option value="" disabled>Select an entry stage</option>
            {programs.slice(0, 4).map((program) => (
              <option key={program.id} value={program.title}>{program.title} · {program.degree}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>How can we help your family?</span>
        <textarea name="message" rows={3} placeholder="Share your child’s current grade or ask our admissions team a question..." />
      </label>
      <div className="form-submit-row">
        <p>By submitting, you agree to be contacted by Horizon School Admissions.</p>
        <button className="button button-lime" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Book a conversation"}
          {status !== "loading" && <ArrowRight size={18} />}
        </button>
      </div>
      {message && (
        <div className={`form-message ${status}`} role="status">
          {status === "success" && <Check size={17} />}
          {message}
        </div>
      )}
    </form>
  );
}

export default function SchoolExperience({ programs, events }: SchoolExperienceProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const reveal = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } };

  return (
    <main id="top">
      <div className="announcement">
        <span>Admissions for the 2026–27 school year are now open</span>
        <a href="#admissions">Book a school tour <ArrowRight size={13} /></a>
      </div>

      <header className="site-header">
        <Logo />
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
          <a href="#academics" onClick={() => setMenuOpen(false)}>Learning</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>School life</a>
          <a href="#campus-3d" onClick={() => setMenuOpen(false)}>Our campus</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>Calendar</a>
          <a href="#admissions" onClick={() => setMenuOpen(false)}>Admissions</a>
        </nav>
        <div className="header-actions">
          <a className="text-link desktop-only" href="#admissions">Parent enquiry</a>
          <a className="button button-dark small" href="#admissions">Apply now <MoveUpRight size={15} /></a>
          <button
            className="menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero page-shell">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={reducedMotion ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span><Sparkles size={14} /></span>
            Nurturing learners ages 3–18
          </motion.div>
          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
          >
            Every child.<br />Ready to <em>rise.</em>
          </motion.h1>
          <motion.p
            className="hero-lead"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            A joyful, future-ready school where curiosity becomes confidence, every child is known, and learning has purpose.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
          >
            <a className="button button-lime" href="#academics">Explore learning <ArrowRight size={18} /></a>
            <a className="play-link" href="#experience"><span><Play size={15} fill="currentColor" /></span> See school life</a>
          </motion.div>
          <div className="hero-proof">
            <div><strong>1:9</strong><span>student to<br />teacher ratio</span></div>
            <div><strong>32+</strong><span>clubs and<br />activities</span></div>
            <div><strong>24</strong><span>nationalities<br />represented</span></div>
          </div>
        </div>
        <motion.div
          className="hero-visual"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <CampusScene />
        </motion.div>
        <a className="scroll-cue" href="#academics" aria-label="Scroll to learning journey"><span /> DISCOVER HORIZON</a>
      </section>

      <section className="marquee-bar" aria-label="Horizon School values">
        <div>
          <span>CURIOUS MINDS</span><i>✦</i><span>KIND HEARTS</span><i>✦</i><span>BOLD FUTURES</span><i>✦</i>
          <span>CURIOUS MINDS</span><i>✦</i><span>KIND HEARTS</span><i>✦</i><span>BOLD FUTURES</span><i>✦</i>
        </div>
      </section>

      <section className="family-trust page-shell" aria-label="Our promise to families">
        <div><span><ShieldCheck size={20} /></span><p><strong>Safeguarding first</strong><small>A secure, caring culture in every space</small></p></div>
        <div><span><Users size={20} /></span><p><strong>Every child is known</strong><small>Small classes and dedicated mentors</small></p></div>
        <div><span><BookOpen size={20} /></span><p><strong>Strong foundations</strong><small>High expectations with joyful learning</small></p></div>
      </section>

      <section className="section page-shell academics" id="academics">
        <motion.div className="section-heading" {...reveal}>
          <div>
            <SectionEyebrow>THE LEARNING JOURNEY</SectionEyebrow>
            <h2>Designed to grow<br />with <em>every child.</em></h2>
          </div>
          <div className="heading-aside">
            <p>From purposeful play to university preparation, each stage builds knowledge, character, creativity, and confidence.</p>
            <a href="#admissions">Find the right stage <ArrowRight size={16} /></a>
          </div>
        </motion.div>

        <div className="program-grid">
          {programs.map((program, index) => {
            const Icon = iconMap[program.icon] || BookOpen;
            return (
              <motion.article
                className={`program-card ${index === 0 ? "featured" : ""}`}
                key={program.id}
                initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={reducedMotion ? undefined : { y: -8 }}
              >
                <div className="program-topline">
                  <span className="program-icon"><Icon size={23} /></span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <span className="degree-label">{program.degree}</span>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <div className="program-footer">
                  <span><Clock3 size={14} /> {program.duration}</span>
                  <a href="#admissions" aria-label={`Learn about ${program.title}`}><ArrowRight size={18} /></a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="campus-model-section" id="campus-3d">
        <div className="page-shell">
          <motion.div className="campus-model-heading" {...reveal}>
            <div>
              <SectionEyebrow>OUR INTERACTIVE CAMPUS</SectionEyebrow>
              <h2>Made for wonder.<br />Built for <em>belonging.</em></h2>
            </div>
            <div className="campus-model-intro">
              <p>Explore a safe, green campus designed around how children learn—through movement, collaboration, discovery, and play.</p>
              <div className="campus-mini-stats">
                <span><b>12</b> ACRES</span>
                <span><b>8</b> SPECIALIST LABS</span>
                <span><b>3</b> PLAY ZONES</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.75 }}
          >
            <CampusModel />
          </motion.div>
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="page-shell experience-grid">
          <motion.div className="experience-image-wrap" {...reveal}>
            <div
              className="experience-image"
              role="img"
              aria-label="Teacher guiding children during a collaborative classroom activity"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(4,16,24,.01), rgba(4,16,24,.34)), url('https://images.pexels.com/photos/8617762/pexels-photo-8617762.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200')",
              }}
            />
            <div className="image-badge"><span>100%</span> of learners have a<br />dedicated class mentor</div>
            <div className="image-index">H / 01</div>
          </motion.div>
          <motion.div className="experience-copy" {...reveal}>
            <SectionEyebrow>THE HORIZON EXPERIENCE</SectionEyebrow>
            <h2>Known deeply.<br />Supported <em>fully.</em></h2>
            <p className="large-copy">Children thrive when they feel safe, seen, and inspired. Our teachers pair high expectations with genuine care, every day.</p>
            <ul className="feature-list">
              <li><span><BrainCircuit size={20} /></span><div><b>Learning through discovery</b><p>Hands-on challenges make knowledge memorable, meaningful, and fun.</p></div></li>
              <li><span><Users size={20} /></span><div><b>Teachers who truly know your child</b><p>Small classes create space for close guidance and individual growth.</p></div></li>
              <li><span><ShieldCheck size={20} /></span><div><b>Wellbeing comes first</b><p>Strong safeguarding, pastoral care, and movement support the whole child.</p></div></li>
            </ul>
            <a className="button button-outline" href="#admissions">Experience a school day <ArrowRight size={17} /></a>
          </motion.div>
        </div>
      </section>

      <section className="research-section" id="approach">
        <div className="research-orb orb-a" />
        <div className="research-orb orb-b" />
        <div className="page-shell research-grid">
          <motion.div className="research-copy" {...reveal}>
            <SectionEyebrow>WHOLE-CHILD EDUCATION</SectionEyebrow>
            <h2>Beyond lessons.<br /><em>Learning comes alive.</em></h2>
            <p>Academic challenge is only the beginning. Sport, music, service, technology, and wellbeing help every learner discover who they can become.</p>
            <a className="button button-light" href="#academics">See our learning approach <ArrowRight size={17} /></a>
          </motion.div>
          <motion.div className="research-console" {...reveal}>
            <div className="console-head"><span><i /> WHOLE-CHILD GROWTH</span><small>EVERY SCHOOL DAY</small></div>
            <div className="console-visual">
              <div className="core-ring ring-one" />
              <div className="core-ring ring-two" />
              <div className="core-ring ring-three" />
              <div className="core"><BookOpen size={27} /></div>
              <span className="data-tag tag-one">CURIOSITY</span>
              <span className="data-tag tag-two">CHARACTER</span>
              <span className="data-tag tag-three">WELLBEING</span>
            </div>
            <div className="console-stats">
              <div><strong>32+</strong><span>clubs & creative<br />activities</span></div>
              <div><strong>14</strong><span>sports & movement<br />pathways</span></div>
              <div><strong>1:9</strong><span>teacher to learner<br />ratio</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section page-shell events" id="events">
        <motion.div className="section-heading compact" {...reveal}>
          <div>
            <SectionEyebrow>SCHOOL CALENDAR</SectionEyebrow>
            <h2>Meet us. See us.<br /><em>Feel at home.</em></h2>
          </div>
          <div className="heading-aside"><p>Join an open morning, meet our educators, and experience the warmth of a Horizon school day.</p></div>
        </motion.div>
        <div className="events-list">
          {events.map((event, index) => {
            const date = formatEventDate(event.date);
            return (
              <motion.article
                className="event-row"
                key={event.id}
                initial={reducedMotion ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="event-date"><span>{date.month}</span><strong>{date.day}</strong></div>
                <div className="event-title"><span>{event.category}</span><h3>{event.title}</h3></div>
                <div className="event-meta"><span><Clock3 size={15} />{event.startTime}</span><span><MapPin size={15} />{event.location}</span></div>
                <a href="#admissions" aria-label={`Register for ${event.title}`}><ArrowRight size={19} /></a>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="student-quote page-shell">
        <motion.div className="quote-card" {...reveal}>
          <Quote size={28} />
          <blockquote>“Our child is not only learning more—he is asking better questions, speaking with confidence, and genuinely excited for school.”</blockquote>
          <div className="quote-person">
            <span>RM</span>
            <p><strong>Riya & Aman Mehta</strong><small>Parents of Aarav · Grade 5</small></p>
          </div>
        </motion.div>
        <div className="quote-side">
          <span className="giant-number">620</span>
          <p>learners and families, connected by kindness, curiosity, and a shared belief in every child&apos;s potential.</p>
          <a href="#admissions">Join our community <ChevronRight size={16} /></a>
        </div>
      </section>

      <section className="admissions-section" id="admissions">
        <div className="page-shell admissions-grid">
          <div className="admissions-copy">
            <SectionEyebrow>BEGIN YOUR HORIZON JOURNEY</SectionEyebrow>
            <h2>A happy school<br />journey starts <em>here.</em></h2>
            <p>Every family&apos;s story is different. Our admissions team will listen, guide you clearly, and help you discover whether Horizon is the right fit.</p>
            <div className="admissions-points">
              <span><Check size={16} /> Personal campus tour</span>
              <span><Check size={16} /> Friendly, guided admissions process</span>
              <span><Check size={16} /> Dedicated family admissions advisor</span>
            </div>
          </div>
          <AdmissionsForm programs={programs} />
        </div>
      </section>

      <footer>
        <div className="page-shell footer-main">
          <div><Logo /><p>Curious minds. Kind hearts.<br />Bold futures.</p></div>
          <div><strong>Discover</strong><a href="#academics">Learning journey</a><a href="#experience">School life</a><a href="#campus-3d">Interactive campus</a></div>
          <div><strong>For families</strong><a href="#admissions">How to apply</a><a href="#events">Book a school tour</a><a href="#approach">Wellbeing & care</a></div>
          <div className="footer-address"><strong>Horizon International School</strong><p>Sector 62, Gurugram<br />Haryana 122102, India</p><a href="mailto:admissions@horizonschool.edu">admissions@horizonschool.edu</a></div>
        </div>
        <div className="page-shell footer-bottom"><span>© 2026 Horizon International School</span><span>Privacy &nbsp; Accessibility &nbsp; Safeguarding</span><span className="made-mark">H✦</span></div>
      </footer>
    </main>
  );
}
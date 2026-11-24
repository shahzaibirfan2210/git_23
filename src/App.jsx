import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { journey, profile, projects, skills } from "./data/portfolio.js";

gsap.registerPlugin(ScrollTrigger);

const Scene3D = lazy(() => import("./components/Scene3D.jsx"));

const navItems = [
  ["About", "#about"],
  ["Expertise", "#expertise"],
  ["Selected work", "#work"],
  ["Journey", "#journey"],
];

const whatsappHref = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
  "Hi Shahzaib, I found your portfolio and would like to connect.",
)}`;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1] } },
};

class SceneBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("The interactive 3D scene could not be initialized.", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="scene-fallback" aria-hidden="true">
          <div className="scene-fallback-orbit"><i /><i /><i /></div>
          <div className="scene-fallback-core" />
          <span>AI / SYSTEM ONLINE</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function Cursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const move = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setActive(Boolean(event.target.closest("a, button")));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <span
      className={`custom-cursor${active ? " is-active" : ""}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      aria-hidden="true"
    />
  );
}

function Loader({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 850);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      aria-label="Loading portfolio"
    >
      <div className="loader-mark">S<span>.</span></div>
      <div className="loader-track"><i /></div>
      <p>MADE OF CURIOSITY</p>
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="wordmark" href="#home" aria-label="Shahzaib, back to top" onClick={closeMenu}>
        S<span>.</span>
      </a>
      <nav className={open ? "nav is-open" : "nav"} aria-label="Main navigation">
        {navItems.map(([label, href], index) => (
          <a key={href} href={href} onClick={closeMenu}>
            <span className="nav-index">0{index + 1}</span>{label}
          </a>
        ))}
        <a className="nav-contact" href="#contact" onClick={closeMenu}>
          Let&apos;s talk <ArrowUpRight size={14} />
        </a>
      </nav>
      <a className="header-cta" href="#contact">Let&apos;s talk <ArrowUpRight size={14} /></a>
      <button
        className="menu-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
    </header>
  );
}

function Eyebrow({ children, number }) {
  return (
    <div className="eyebrow">
      {number && <span className="eyebrow-number">{number}</span>}
      <span className="eyebrow-rule" />
      <span>{children}</span>
    </div>
  );
}

function SectionHeading({ number, eyebrow, title, highlight }) {
  return (
    <motion.div
      className="section-heading"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Eyebrow number={number}>{eyebrow}</Eyebrow>
      <h2>{title}{highlight && <> <span>{highlight}</span></>}</h2>
    </motion.div>
  );
}

function Hero({ reducedMotion }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-scene" aria-hidden="true">
        <SceneBoundary>
          <Suspense fallback={<div className="scene-loading"><span /></div>}>
            <Scene3D reducedMotion={reducedMotion} characterModel={profile.characterModel} />
          </Suspense>
        </SceneBoundary>
      </div>
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-content">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Eyebrow><span className="availability-dot" /> AI ENGINEERING STUDENT <span className="eyebrow-separator">—</span> PORTFOLIO 2026</Eyebrow>
          <h1 id="hero-title">
            Hey, I&apos;m
            <span className="hero-name">Shahzaib<span className="hero-period">.</span></span>
          </h1>
          <p className="hero-statement">Building intelligent<br />futures with <span>AI.</span></p>
          <p className="hero-description">
            Exploring the space between human curiosity and machine intelligence — one idea at a time.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore my work <ArrowRight size={16} /></a>
            <a className="button button-text" href="#contact">Let&apos;s connect <MoveUpRight size={15} /></a>
          </div>
        </motion.div>
      </div>
      <div className="hero-side-note" aria-hidden="true"><span>FIG. 01</span> — CURIOSITY IN MOTION</div>
      <div className="hero-bottom">
        <span className="hero-location"><span className="status-pulse" /> OPEN TO MEANINGFUL COLLABORATION</span>
        <a href="#about" className="scroll-cue">SCROLL TO EXPLORE <ArrowDown size={14} /></a>
        <span className="hero-coordinate">ALWAYS LEARNING&nbsp; / &nbsp;01</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="section-shell about-layout">
        <div className="about-copy">
          <SectionHeading number="01" eyebrow="A LITTLE ABOUT ME" title="Beyond ordinary" highlight="code." />
          <motion.div className="about-body" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="about-lead">
              I&apos;m Shahzaib — an AI Engineering Student exploring the future of intelligent technology.
            </p>
            <p className="body-copy">
              I love building AI-powered applications, experimenting with machine learning models, and transforming ideas into practical digital solutions. I&apos;m here to stay curious, learn by making, and build things that matter.
            </p>
            <a href="#journey" className="inline-link">A bit more about my journey <ArrowRight size={15} /></a>
          </motion.div>
        </div>
        <motion.div className="about-art" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="about-art-core"><Sparkles size={31} strokeWidth={1.1} /></div>
          <div className="orbit-node node-a" /><div className="orbit-node node-b" /><div className="orbit-node node-c" />
          <div className="art-caption"><span>01 / 04</span><span>CURIOUS BY NATURE</span></div>
          <div className="art-side-label">IDEAS &rarr; INTELLIGENCE</div>
        </motion.div>
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section className="section expertise-section" id="expertise">
      <div className="section-shell">
        <div className="expertise-intro">
          <SectionHeading number="02" eyebrow="WHAT I'M EXPLORING" title="Tools for the" highlight="unknown." />
          <p className="body-copy expertise-note">A growing toolkit, shaped by curiosity and hands-on practice. Always learning, always iterating.</p>
        </div>
        <motion.div className="skills-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={{ visible: { transition: { staggerChildren: 0.055 } } }}>
          {skills.map((skill, index) => (
            <motion.div className="skill-card" key={skill} variants={fadeUp}>
              <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="skill-name">{skill}</span>
              <ArrowUpRight className="skill-arrow" size={15} />
            </motion.div>
          ))}
        </motion.div>
        <div className="skills-footnote"><span className="availability-dot" /> SKILLS IN PROGRESS, NOT BOXES TO CHECK</div>
      </div>
    </section>
  );
}

function ProjectVisual({ type }) {
  return (
    <div className={`project-visual visual-${type}`} aria-hidden="true">
      <div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" />
      <div className="visual-center">
        {type === "vision" && <div className="vision-eye"><span /></div>}
        {type === "model" && <div className="model-bars"><i /><i /><i /><i /><i /></div>}
        {type === "app" && <div className="app-window"><i /><i /><i /><b /></div>}
        {type === "automation" && <div className="automation-nodes"><i /><i /><i /><i /></div>}
      </div>
      <span className="visual-coord">0{type === "vision" ? "1" : type === "model" ? "2" : type === "app" ? "3" : "4"} / FIELD NOTES</span>
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.article className="project-card" variants={fadeUp}>
      <ProjectVisual type={project.visual} />
      <div className="project-meta"><span>EXPERIMENT {project.number}</span><span>0{index + 1} — 04</span></div>
      <h3>{project.title}</h3>
      <p className="body-copy project-description">{project.description}</p>
      <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="project-links">
        {[
          ["Live demo", project.demo],
          ["GitHub", project.github],
        ].map(([label, href]) => href ? (
          <a key={label} href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={13} /></a>
        ) : (
          <button key={label} type="button" disabled title={`Add a real ${label} URL in src/data/portfolio.js`}>
            {label}<span className="link-pending">ADD LINK</span>
          </button>
        ))}
      </div>
    </motion.article>
  );
}

function Projects() {
  return (
    <section className="section work-section" id="work">
      <div className="section-shell">
        <div className="work-heading">
          <SectionHeading number="03" eyebrow="IDEAS, IN PROGRESS" title="Made to" highlight="explore." />
          <p className="body-copy">A few project starting points. The best work begins with a good question — these are mine.</p>
        </div>
        <motion.div className="projects-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
        </motion.div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section journey-section" id="journey">
      <div className="section-shell journey-layout">
        <div className="journey-intro">
          <SectionHeading number="04" eyebrow="STILL BECOMING" title="Learning is the" highlight="work." />
          <p className="body-copy">Not a list of job titles. Just a map of what I&apos;m exploring, one new layer at a time.</p>
          <span className="journey-stamp"><Command size={13} /> ALWAYS IN BETA</span>
        </div>
        <div className="timeline">
          {journey.map((item, index) => (
            <motion.article className="timeline-item" key={item.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="timeline-point"><i /></span>
              <div className="timeline-date">{item.date}<span>0{index + 1}</span></div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p className="body-copy">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, label, icon: Icon }) {
  return href ? (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={17} />{label}<ArrowUpRight size={13} /></a>
  ) : (
    <span className="social-link is-unset" title={`Add your ${label} URL in src/data/portfolio.js`}><Icon size={17} />{label}<span className="link-pending">ADD LINK</span></span>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      className="whatsapp-float"
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Shahzaib on WhatsApp"
    >
      <MessageCircle size={31} strokeWidth={2.2} aria-hidden="true" />
      <span className="whatsapp-float-copy">
        <strong>Chat on WhatsApp</strong>
        <span>Send me a message</span>
      </span>
      <ArrowUpRight className="whatsapp-float-arrow" size={16} aria-hidden="true" />
    </a>
  );
}

function Contact() {
  const form = useRef(null);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const currentForm = form.current;
    if (!currentForm?.reportValidity()) return;

    const fields = new FormData(currentForm);
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: fields.get("message"),
          company: fields.get("company"),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(result.error || "Could not send your message. Please try again.");
        return;
      }

      currentForm.reset();
      setStatus("sent");
      setFeedback("Your message was sent. Thanks for reaching out.");
    } catch (error) {
      console.error("Could not send portfolio contact message.", error);
      setStatus("error");
      setFeedback("Could not send your message right now. Please try again.");
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="section-shell">
        <div className="contact-top">
          <Eyebrow number="05">THE NEXT GOOD IDEA</Eyebrow>
          <span className="contact-index">LET&apos;S MAKE IT REAL&nbsp; ↗</span>
        </div>
        <div className="contact-layout">
          <div className="contact-copy">
            <h2>Have an idea?<br />Let&apos;s build something <span>intelligent.</span></h2>
            <p className="body-copy">A question, a collaboration, or just a hello — my inbox is open.</p>
            <a className="email-link" href="#contact-form"><Mail size={17} />SEND A MESSAGE THROUGH THE FORM<ArrowUpRight size={15} /></a>
            <div className="social-links">
              <SocialLink href={whatsappHref} label="WhatsApp" icon={MessageCircle} />
              <SocialLink href={profile.github} label="GitHub" icon={Github} />
              <SocialLink href={profile.linkedin} label="LinkedIn" icon={Linkedin} />
            </div>
            <span className="contact-location"><span className="availability-dot" /> {profile.location}</span>
          </div>
          <form className="contact-form" id="contact-form" ref={form} onSubmit={submit} aria-busy={status === "sending"}>
            <div className="form-heading"><span>01 / SEND A NOTE</span><Sparkles size={16} /></div>
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" autoComplete="name" maxLength={120} placeholder="How should I call you?" required />
            <label htmlFor="contact-email">Email address</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required />
            <label htmlFor="contact-message">A little about it</label>
            <textarea id="contact-message" name="message" rows="3" maxLength={5000} placeholder="What's on your mind?" required />
            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="contact-company">Leave this field empty</label>
              <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>
            <button className="button button-primary form-submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? <>Sending message… <ArrowRight size={16} /></> :
                status === "sent" ? <>Message sent <Check size={16} /></> :
                  status === "error" ? <>Try again <ArrowRight size={16} /></> :
                    <>Send message <ArrowRight size={16} /></>}
            </button>
            {feedback && (
              <p className={`form-feedback is-${status}`} role={status === "error" ? "alert" : "status"}>
                {feedback}
              </p>
            )}
            <span className="form-note">Delivered by email. Your address is used so Shahzaib can reply.</span>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark footer-mark" href="#home">S<span>.</span></a>
      <span>BUILT WITH CURIOSITY &amp; A LITTLE BIT OF CAFFEINE.</span>
      <a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={13} /></a>
      <span className="copyright">&copy; {new Date().getFullYear()} {profile.name}</span>
    </footer>
  );
}

function NotFound() {
  return (
    <main className="not-found">
      <span className="not-found-code">404</span>
      <h1>This page wandered<br />off the <span>neural net.</span></h1>
      <p>There&apos;s nothing to compute here. Let&apos;s get you back to the signal.</p>
      <a className="button button-primary" href="/">Back to the portfolio <ArrowRight size={16} /></a>
    </main>
  );
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const finishLoading = () => setLoading(false);

  useEffect(() => {
    if (window.location.pathname !== "/") return undefined;
    const context = gsap.context(() => {
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.25 },
      });
    });
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) document.documentElement.classList.add("reduce-motion");
    else document.documentElement.classList.remove("reduce-motion");
    return () => document.documentElement.classList.remove("reduce-motion");
  }, [prefersReducedMotion]);

  if (window.location.pathname !== "/") return <NotFound />;

  return (
    <>
      <AnimatePresence>{loading && <Loader onComplete={finishLoading} />}</AnimatePresence>
      <Cursor />
      <FloatingWhatsApp />
      <div className="scroll-progress" aria-hidden="true" />
      <Header />
      <main>
        <Hero reducedMotion={prefersReducedMotion} />
        <About />
        <Expertise />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

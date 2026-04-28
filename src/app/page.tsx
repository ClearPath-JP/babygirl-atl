"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── Data ────────────────────────────────────────────────────── */
const BRUNCH_MENU = [
  { name: "Biscuit Sandwich", price: 12, desc: "Three-ingredient biscuit, fried chicken thigh, swiss fondue, chive omelette" },
  { name: "Scotch Egg", price: 14, desc: "Crispy coated, farm egg, mustard greens" },
  { name: "Omelette + Salad", price: 16, desc: "Seasonal vegetables, mixed greens, herbs" },
  { name: "Steak + Eggs", price: 24, desc: "Riverview Farms beef, two eggs any style, toast" },
  { name: "Belgian Waffle", price: 12, desc: "Maple butter, seasonal fruit, whipped cream" },
  { name: "Grit Bowl", price: 15, desc: "Stone-ground grits, braised greens, poached egg" },
  { name: "Granola + Yogurt", price: 15, desc: "House granola, seasonal fruit, honey" },
  { name: "Egg on Toast", price: 12, desc: "Sourdough, herb butter, sea salt" },
];

const PM_MENU = [
  { name: "Smash Burger Deluxe", price: 16, desc: "Riverview Farms beef, shaved Vidalia onion, white American, special sauce" },
  { name: "Fried Chicken Sandwich", price: 16, desc: "Buttermilk brined, pickles, slaw, brioche" },
  { name: "Chicken Cobb Salad", price: 17, desc: "Grilled chicken, avocado, egg, bacon, blue cheese" },
  { name: "Citrus Salad", price: 17, desc: "Seasonal citrus, arugula, shaved fennel, olive oil" },
  { name: "Fondue Fries", price: 7, desc: "Hand-cut, swiss fondue, herbs" },
  { name: "Cheese Toast", price: 6, desc: "Sourdough, melted gruyere, black pepper" },
  { name: "Broccolini", price: 6, desc: "Charred, chili flake, lemon" },
  { name: "Ice Cream Sundae", price: 7, desc: "Rotating flavors, house toppings" },
];

const DRINKS = [
  { name: "Drip Coffee", price: 4, desc: "Natural Born Koffee, single-varietal" },
  { name: "Espresso", price: 4, desc: "Double shot, pulled fresh" },
  { name: "Bananacado Smoothie", price: 6, desc: "Banana, avocado, honey, oat milk" },
  { name: "Fresh Grapefruit Juice", price: 6, desc: "Squeezed to order" },
  { name: "Iced Tea", price: 4, desc: "House brewed, unsweetened" },
  { name: "Mexican Coke", price: 4, desc: "Glass bottle, real cane sugar" },
];

const HOURS = [
  { day: "Monday — Friday", time: "9 am — 4 pm", note: "P.M. menu from 11" },
  { day: "Saturday — Sunday", time: "9 am — 4 pm", note: "Brunch all day" },
];

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#space", label: "The Space" },
  { href: "#visit", label: "Visit" },
  { href: "https://www.instagram.com/babygirl.atl/", label: "Instagram", external: true },
];

/* ─── Fade-in wrapper ─────────────────────────────────────────── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scroll progress bar ─────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-16 left-0 right-0 h-[2px] z-50"
    >
      <div className="w-full h-full bg-[#C5D63D]" />
    </motion.div>
  );
}

/* ─── Ambient light orbs ─────────────────────────────────────── */
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #C5D63D 0%, transparent 70%)",
          top: "10%",
          right: "-5%",
          animation: "orbDrift1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.035]"
        style={{
          background: "radial-gradient(circle, #E8963D 0%, transparent 70%)",
          top: "40%",
          left: "-10%",
          animation: "orbDrift2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #D44E3C 0%, transparent 70%)",
          bottom: "15%",
          right: "5%",
          animation: "orbDrift3 22s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 50px) scale(0.9); }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -30px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}

/* ─── Photo card with parallax ───────────────────────────────── */
function PhotoCard({ src, alt, index }: { src: string; alt: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
      className="aspect-[4/3] rounded-2xl overflow-hidden"
    >
      <motion.img
        style={{ y }}
        src={src}
        alt={alt}
        className="w-[100%] h-[120%] object-cover hover:scale-105 transition-transform duration-[1.2s] ease-out"
      />
    </motion.div>
  );
}

/* ─── Parallax image ─────────────────────────────────────────── */
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden"
    >
      <motion.img style={{ y }} src={src} alt={alt} className="w-[100%] h-[120%] object-cover" />
    </motion.div>
  );
}

/* ─── Menu item row ──────────────────────────────────────────── */
function MenuItem({ item, index }: { item: { name: string; price: number; desc?: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-baseline justify-between gap-4 py-5 border-b border-[#e8e4df] transition-colors duration-300 group-hover:border-[#C5D63D]">
        <div className="flex-1 min-w-0">
          <h3 className="text-[clamp(16px,1.4vw,20px)] font-medium text-[#1a1a1a] tracking-[-0.01em]">
            {item.name}
          </h3>
          {item.desc && (
            <p className="text-[clamp(12px,1vw,14px)] text-[#8a8580] mt-1 leading-relaxed">
              {item.desc}
            </p>
          )}
        </div>
        <span className="text-[clamp(14px,1.2vw,18px)] font-light text-[#1a1a1a] tabular-nums shrink-0">
          ${item.price}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Section heading ────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8a8580] mb-8">
        {children}
      </p>
    </Reveal>
  );
}

/* ─── Hamburger icon ─────────────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        className="block w-full h-[1.5px] bg-[#1a1a1a] origin-center"
        transition={{ duration: 0.3 }}
      />
      <motion.span
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        className="block w-full h-[1.5px] bg-[#1a1a1a]"
        transition={{ duration: 0.2 }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        className="block w-full h-[1.5px] bg-[#1a1a1a] origin-center"
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

/* ─── Draw-line observer ─────────────────────────────────────── */
function DrawLine({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("drawn"); obs.disconnect(); } },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <span ref={ref} className={`text-draw-line ${className}`}>{children}</span>;
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function BabygirlPage() {
  const [menuTab, setMenuTab] = useState<"brunch" | "pm" | "drinks">("brunch");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60]);

  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [mobileMenuOpen]);

  const activeMenu = menuTab === "brunch" ? BRUNCH_MENU : menuTab === "pm" ? PM_MENU : DRINKS;

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "#FAF8F5", color: "#1a1a1a", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <ScrollProgress />
      <AmbientOrbs />

      {/* ─── Nav ──────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#FAF8F5]/80 border-b border-[#e8e4df]/60"
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="text-[18px] font-medium tracking-[-0.02em] text-[#1a1a1a]">
            babygirl
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-normal text-[#8a8580]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="hover:text-[#1a1a1a] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#e8e4df]"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 text-[16px] text-[#1a1a1a] font-normal border-b border-[#e8e4df]/50 last:border-0"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="tel:+14045499692"
                  className="mt-2 py-3 text-[16px] font-medium text-[#9a8c5a]"
                >
                  Call (404) 549-9692
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="top"
        className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/images/interior-stained-glass.png"
            alt="Babygirl interior — stained glass windows casting warm light across the dining room"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.05) 100%)" }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative px-6 sm:px-10 pb-16 sm:pb-24 pt-32 max-w-[1400px] mx-auto w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[clamp(12px,1vw,14px)] font-normal text-white/60 tracking-[0.2em] uppercase mb-4 sm:mb-6"
          >
            East Lake, Atlanta
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(56px,10vw,140px)] font-light leading-[0.9] tracking-[-0.04em] text-white mb-6 sm:mb-8 heading-breathe text-glow"
          >
            babygirl
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[clamp(16px,1.6vw,22px)] font-light text-white/80 max-w-[600px] leading-[1.5]"
          >
            A calming neighborhood diner. <span className="text-key-light">Coffee early</span>, food all day,
            lights low when evening comes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap items-center gap-3 sm:gap-6 mt-8 sm:mt-10 text-[13px] text-white/50"
          >
            <span>Open daily 9 am — 4 pm</span>
            <span className="w-1 h-1 rounded-full bg-[#C5D63D] hidden sm:block" />
            <span className="hidden sm:inline">East Lake</span>
            <span className="w-1 h-1 rounded-full bg-[#C5D63D] hidden sm:block" />
            <a href="tel:+14045499692" className="text-white/70 hover:text-white transition-colors">
              (404) 549-9692
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── Photo Strip ─────────────────────────────────── */}
      <section
        className="px-6 sm:px-10"
        style={{ paddingTop: "clamp(48px, 8vw, 120px)", paddingBottom: "clamp(32px, 5vw, 80px)" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <PhotoCard src="/images/hero-spread.jpg" alt="Chicken and waffles with braised greens, granola yogurt bowl with fresh raspberries" index={0} />
            <PhotoCard src="/images/waffle-window.png" alt="Belgian waffle with strawberries bathed in golden stained glass light" index={1} />
            <PhotoCard src="/images/salmon-egg-bowl.png" alt="Smoked salmon and fried egg over hashbrowns with chives and capers" index={2} />
          </div>
        </div>
      </section>

      {/* ─── About ────────────────────────────────────────── */}
      <section
        id="about"
        className="relative px-6 sm:px-10"
        style={{ paddingTop: "clamp(64px, 10vw, 160px)", paddingBottom: "clamp(64px, 10vw, 160px)" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-24 items-start">
            <div>
              <SectionLabel>About</SectionLabel>
              <Reveal delay={0.1}>
                <h2 className="text-[clamp(32px,3.5vw,52px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] heading-breathe">
                  Good food.
                  <br />
                  <span className="text-gold">Real vibes.</span>
                </h2>
              </Reveal>
            </div>

            <div className="space-y-6">
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-[#4a4540]">
                  Babygirl is what happens when a <span className="text-key">Michelin-recognized chef</span>{" "}
                  builds a restaurant for his neighborhood instead of a
                  dining guide. Chef Hudson Rouse — the same hands behind
                  Whoopsie&apos;s, Rising Son, and Pure Quill Superette —
                  wanted a place where East Lake could <span className="text-key">sit down, eat well,
                  and not have to think too hard about it.</span>
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-[#4a4540]">
                  The menu changes with the seasons because the farms do.
                  Three-ingredient biscuits — <span className="text-gold">White Lily flour, butter,
                  buttermilk</span>, nothing else. Coffee pulled from Natural Born
                  Koffee single-varietal beans. Smash burgers made with
                  Riverview Farms beef. <DrawLine>Everything here is intentional, nothing
                  is fussy.</DrawLine>
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-[#4a4540]">
                  Named after his two daughters — because <span className="text-amber font-medium">some things are
                  just personal like that.</span>
                </p>
              </Reveal>

              <Reveal delay={0.5}>
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-8">
                  {["Michelin-recognized chef", "Farm-to-table", "Seasonal menu", "Natural wine + cocktails", "Free parking"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] font-medium tracking-[0.05em] text-[#5a5550] border border-[#ddd6ce] rounded-full bg-[#f5f0ea]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pull Quote ──────────────────────────────────── */}
      <section
        className="relative px-6 sm:px-10"
        style={{ paddingTop: "clamp(48px, 8vw, 120px)", paddingBottom: "clamp(48px, 8vw, 120px)", background: "#f0ece7" }}
      >
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal>
            <blockquote className="text-[clamp(20px,3vw,40px)] font-light leading-[1.3] tracking-[-0.02em] text-[#2a2520]">
              &ldquo;The space is <span className="text-gold font-medium">really well done</span> and the outside vibe near
              the fountain was great. <span className="text-key">Tons of flavor</span> and great healthy
              options too.&rdquo;
            </blockquote>
            <p className="text-[13px] text-[#8a8580] mt-6 tracking-[0.1em] uppercase">
              — Google Review, <span className="text-chartreuse font-medium">4.5 stars</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Menu ─────────────────────────────────────────── */}
      <section
        id="menu"
        className="relative px-6 sm:px-10"
        style={{ paddingTop: "clamp(64px, 10vw, 160px)", paddingBottom: "clamp(64px, 10vw, 160px)" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionLabel>Menu</SectionLabel>
              <Reveal delay={0.1}>
                <h2 className="text-[clamp(28px,3.5vw,52px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-4">
                  {greeting},
                  <br />
                  <span style={{ color: "#9a8c5a" }}>what are you having?</span>
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] text-[#8a8580] mb-8 sm:mb-10 max-w-[360px]">
                  <span className="text-key">Vegetable-forward plates</span>, Southern comfort, and everything
                  in between. The menu moves with the seasons — <span className="text-gold">what&apos;s here
                  today might be gone tomorrow.</span>
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "brunch", label: "Brunch" },
                    { key: "pm", label: "P.M. Menu" },
                    { key: "drinks", label: "Drinks" },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setMenuTab(key)}
                      className="px-5 py-3 text-[14px] sm:text-[13px] font-medium rounded-full transition-all duration-300 min-h-[48px] sm:min-h-0 sm:py-2.5"
                      style={{
                        background: menuTab === key ? "#1a1a1a" : "transparent",
                        color: menuTab === key ? "#FAF8F5" : "#8a8580",
                        border: menuTab === key ? "1px solid #1a1a1a" : "1px solid #ddd6ce",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="text-[12px] text-[#8a8580] mt-4 sm:mt-6 leading-relaxed">
                  {menuTab === "brunch" ? "Served Saturday & Sunday, 9 am — 4 pm" : menuTab === "pm" ? "Served Monday — Friday, 11 am — 4 pm" : "Available all day"}
                </p>
              </Reveal>
            </div>

            <div>
              <motion.div
                key={menuTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeMenu.map((item, i) => (
                  <MenuItem key={item.name} item={item} index={i} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The Space ────────────────────────────────────── */}
      <section
        id="space"
        className="relative overflow-hidden"
        style={{ background: "#1a1a1a", paddingTop: "clamp(64px, 10vw, 160px)", paddingBottom: "clamp(64px, 10vw, 160px)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-24 items-center">
            <ParallaxImage src="/images/interior-stained-glass.png" alt="Floor-to-ceiling stained glass panels in yellow, orange, and chartreuse" />

            <div>
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8a8580] mb-8">The Space</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-[clamp(28px,3.5vw,52px)] font-light leading-[1.1] tracking-[-0.03em] text-white mb-6">
                  Light through
                  <br />
                  <span className="text-[#C5D63D]">stained glass</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-white/60 mb-8">
                  The first thing you notice is the light. <span className="text-key-light">Floor-to-ceiling
                  stained glass panels</span> — <span className="text-chartreuse">chartreuse</span>, <span className="text-amber">amber</span>, burnt orange, deep
                  red — turn the dining room into something that feels like
                  <span className="text-key-light">sitting inside a sunset.</span> Designed by Claudhaus with a
                  Danish-Japanese sensibility: light wood, clean lines,
                  and nothing that doesn&apos;t need to be there.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-white/60 mb-10">
                  In the morning it&apos;s bright and open — regulars with
                  coffee, neighbors catching up. By afternoon <span className="text-key-light">the light
                  shifts, the room warms</span>, and it feels like you&apos;ve been
                  here for hours in the best way.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { number: "60", label: "seats inside" },
                    { number: "30", label: "on the patio" },
                    { number: "10", label: "at the bar" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[clamp(28px,3vw,44px)] font-light text-[#C5D63D] tracking-[-0.03em]">{s.number}</p>
                      <p className="text-[12px] text-white/40 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Second food photo ────────────────────────────── */}
      <section className="px-6 sm:px-10" style={{ paddingTop: "clamp(48px, 8vw, 120px)", paddingBottom: "clamp(48px, 8vw, 120px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <PhotoCard src="/images/grit-bowl.png" alt="Stone-ground grit bowl with fried eggs and braised greens" index={0} />
            <PhotoCard src="/images/hero-spread.jpg" alt="Table spread with chicken and waffles, fresh flowers, granola bowl" index={1} />
          </div>
        </div>
      </section>

      {/* ─── Exterior / Neighborhood ─────────────────────── */}
      <section className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(48px, 8vw, 100px)", paddingBottom: "clamp(48px, 8vw, 100px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-center">
            <Reveal>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src="/images/exterior-building.jpg"
                  alt="Babygirl exterior — black brick building with triangular roof in East Lake"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
            <div>
              <SectionLabel>The Neighborhood</SectionLabel>
              <Reveal delay={0.1}>
                <h2 className="text-[clamp(28px,3.5vw,48px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-6 heading-breathe">
                  East Lake.
                  <br />
                  <span className="text-gold">Your corner spot.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-[#4a4540]">
                  Tucked into the <span className="text-key">Hosea + 2nd development</span> alongside
                  Gene&apos;s and Poor Hendrix. <span className="text-gold">Free parking right out front.</span>{" "}
                  No meter. No stress. Just pull up.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Visit ────────────────────────────────────────── */}
      <section
        id="visit"
        className="relative px-6 sm:px-10"
        style={{ paddingTop: "clamp(64px, 10vw, 160px)", paddingBottom: "clamp(64px, 10vw, 160px)", background: "#f0ece7" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-24">
            <div>
              <SectionLabel>Visit</SectionLabel>
              <Reveal delay={0.1}>
                <h2 className="text-[clamp(28px,3.5vw,52px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-4">
                  Pull up.
                  <br />
                  <span style={{ color: "#9a8c5a" }}>We saved you a seat.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] text-[#8a8580] mb-8 sm:mb-10 max-w-[420px]">
                  <span className="text-key">Walk-ins only.</span> No reservations, no pretense. Just show up,
                  grab a table, and let us feed you. <span className="text-gold">Free parking</span> in our
                  dedicated lot right out front.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#8a8580] mb-3">Address</p>
                    <a
                      href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[clamp(15px,1.3vw,18px)] font-light text-[#1a1a1a] leading-relaxed hover:text-[#9a8c5a] transition-colors duration-300"
                    >
                      2371 Hosea L. Williams Dr SE
                      <br />
                      Suite C, Atlanta, GA 30317
                    </a>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#8a8580] mb-3">Hours</p>
                    {HOURS.map((h) => (
                      <div key={h.day} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between max-w-[400px] py-3 border-b border-[#ddd6ce]">
                        <span className="text-[15px] sm:text-[clamp(14px,1.2vw,16px)] font-medium text-[#1a1a1a]">{h.day}</span>
                        <div className="flex items-baseline gap-3 mt-1 sm:mt-0">
                          <span className="text-[15px] sm:text-[clamp(14px,1.2vw,16px)] font-light text-[#5a5550]">{h.time}</span>
                          {h.note && <span className="text-[11px] text-[#9a8c5a] font-medium tracking-[0.05em]">{h.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile-friendly action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href="tel:+14045499692"
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:py-3 rounded-full bg-[#1a1a1a] text-white text-[14px] font-medium hover:bg-[#2a2520] transition-colors duration-300 min-h-[48px]"
                    >
                      Call (404) 549-9692
                    </a>
                    <a
                      href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:py-3 rounded-full border border-[#1a1a1a] text-[#1a1a1a] text-[14px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 min-h-[48px]"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#e8e4df]">
                <iframe
                  title="Babygirl location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.1!2d-84.3117!3d33.7508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5044e1c324e5d%3A0x2371!2s2371+Hosea+L+Williams+Dr+SE%2C+Atlanta%2C+GA+30317!5e0!3m2!1sen!2sus!4v1"
                  className="absolute inset-0 w-full h-full border-0 opacity-80"
                  style={{ filter: "saturate(0.3) contrast(1.1)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none border border-[#ddd6ce] rounded-2xl" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-12 sm:py-16" style={{ background: "#1a1a1a" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div>
              <p className="text-[clamp(32px,4vw,56px)] font-light tracking-[-0.03em] text-white leading-[1]">babygirl</p>
              <p className="text-[14px] text-white/40 mt-3">All day dining &middot; Cafe &middot; Restaurant &middot; Bar</p>
            </div>
            <a
              href="tel:+14045499692"
              className="text-[clamp(18px,2vw,24px)] font-light text-[#C5D63D] hover:text-white transition-colors duration-300 tracking-[-0.02em]"
            >
              (404) 549-9692
            </a>
          </div>

          <div className="h-[1px] bg-white/10 mb-8" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[13px] text-white/30">2371 Hosea L. Williams Dr SE, Suite C, Atlanta, GA 30317</p>
            <div className="flex items-center gap-8 sm:gap-6 text-[14px] sm:text-[13px] text-white/40 py-2">
              <a href="https://www.instagram.com/babygirl.atl/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 min-h-[44px] flex items-center">
                Instagram
              </a>
              <a href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 min-h-[44px] flex items-center">
                Directions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

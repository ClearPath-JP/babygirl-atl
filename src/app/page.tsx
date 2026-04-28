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
  { name: "Biscuit Sandwich", price: 12, desc: "Three-ingredient biscuit, fried chicken thigh, swiss fondue, chive omelette", image: "/images/hero-spread.jpg" },
  { name: "Scotch Egg", price: 14, desc: "Crispy coated, farm egg, mustard greens" },
  { name: "Omelette + Salad", price: 16, desc: "Seasonal vegetables, mixed greens, herbs" },
  { name: "Steak + Eggs", price: 24, desc: "Riverview Farms beef, two eggs any style, toast", image: "/images/salmon-egg-bowl.png" },
  { name: "Belgian Waffle", price: 12, desc: "Maple butter, seasonal fruit, whipped cream", image: "/images/waffle-window.png" },
  { name: "Grit Bowl", price: 15, desc: "Stone-ground grits, braised greens, poached egg", image: "/images/grit-bowl.png" },
  { name: "Granola + Yogurt", price: 15, desc: "House granola, seasonal fruit, honey" },
  { name: "Egg on Toast", price: 12, desc: "Sourdough, herb butter, sea salt" },
];

const PM_MENU = [
  { name: "Smash Burger Deluxe", price: 16, desc: "Riverview Farms beef, shaved Vidalia onion, white American, special sauce" },
  { name: "Fried Chicken Sandwich", price: 16, desc: "Buttermilk brined, pickles, slaw, brioche", image: "/images/hero-spread.jpg" },
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

const REVIEWS = [
  { text: "The space is really well done and the outside vibe near the fountain was great. Tons of flavor and great healthy options too.", author: "Marcus T.", source: "Google" },
  { text: "Best brunch in East Lake, hands down. The biscuit sandwich changed my life. We come every Saturday.", author: "Jasmine R.", source: "Google" },
  { text: "Finally a neighborhood spot that doesn't feel like it's trying too hard. Great coffee, better food.", author: "David K.", source: "Google" },
  { text: "Chef Rouse brought something special to this corner. The grit bowl is unreal and the stained glass makes it feel like church.", author: "Keisha M.", source: "Yelp" },
  { text: "Walk-in only and worth the wait. Seasonal menu means every visit is different. My new spot.", author: "Alex P.", source: "Google" },
];

const HOURS = [
  { day: "Monday — Friday", time: "9 am — 4 pm", note: "P.M. menu from 11" },
  { day: "Saturday — Sunday", time: "9 am — 4 pm", note: "Brunch all day" },
];

/* ─── Components ─────────────────────────────────────────────── */

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{ scaleX, transformOrigin: "0%" }} className="fixed top-16 left-0 right-0 h-[2px] z-50">
      <div className="w-full h-full bg-[#C5D63D]" />
    </motion.div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] bg-current origin-center" transition={{ duration: 0.3 }} />
      <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1.5px] bg-current" transition={{ duration: 0.2 }} />
      <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] bg-current origin-center" transition={{ duration: 0.3 }} />
    </div>
  );
}

/* ─── Menu Card ──────────────────────────────────────────────── */
function MenuCard({ item, index }: { item: { name: string; price: number; desc: string; image?: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group"
    >
      <div className="menu-item-row rounded-xl overflow-hidden border border-[#e8e4df] hover:border-[#9a8c5a]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#9a8c5a]/5">
        {item.image && (
          <div className="aspect-[16/10] overflow-hidden bg-[#f0ece7]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}
        {!item.image && (
          <div className="aspect-[16/10] bg-[#f0ece7] flex items-center justify-center">
            <span className="text-[32px] text-[#ddd6ce]">&#9672;</span>
          </div>
        )}
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h3 className="menu-item-name text-[16px] font-medium text-[#1a1a1a] tracking-[-0.01em] transition-colors duration-300">
              {item.name}
            </h3>
            <span className="text-[15px] font-light text-[#9a8c5a] tabular-nums shrink-0">
              ${item.price}
            </span>
          </div>
          <p className="text-[13px] text-[#8a8580] leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Review Marquee ─────────────────────────────────────────── */
function ReviewMarquee() {
  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-6"
        animate={{ x: [0, -1920] }}
        transition={{ x: { duration: 35, repeat: Infinity, ease: "linear" } }}
      >
        {[...REVIEWS, ...REVIEWS].map((review, i) => (
          <div
            key={i}
            className="shrink-0 w-[380px] p-6 rounded-xl border border-[#e8e4df] bg-white"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, s) => (
                <span key={s} className="text-[#C5D63D] text-[14px]">&#9733;</span>
              ))}
            </div>
            <p className="text-[14px] text-[#4a4540] leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#1a1a1a]">{review.author}</span>
              <span className="text-[11px] text-[#8a8580] tracking-[0.05em]">{review.source}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function BabygirlPage() {
  const [menuTab, setMenuTab] = useState<"brunch" | "pm" | "drinks">("brunch");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60]);

  // Track scroll for nav color change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <div className="min-h-screen relative" style={{ background: "#FAF8F5", color: "#1a1a1a" }}>
      <ScrollProgress />

      {/* ─── Nav ──────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(250,248,245,0.95)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(232,228,223,0.6)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#top" className={`font-serif-display text-[20px] font-medium tracking-[-0.02em] transition-colors duration-500 ${scrolled ? "text-[#1a1a1a]" : "text-white"}`}>
            babygirl
          </a>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-8 text-[13px] font-normal transition-colors duration-500 ${scrolled ? "text-[#8a8580]" : "text-white/70"}`}>
            {[
              { href: "#about", label: "About" },
              { href: "#menu", label: "Menu" },
              { href: "#space", label: "The Space" },
              { href: "#visit", label: "Visit" },
            ].map((link) => (
              <a key={link.label} href={link.href} className={`nav-link ${scrolled ? "hover:text-[#1a1a1a]" : "hover:text-white"} transition-colors duration-300`}>
                {link.label}
              </a>
            ))}
            <a
              href="tel:+14045499692"
              className="ml-2 px-4 py-2 rounded-full text-[12px] font-medium transition-all duration-300"
              style={{
                background: scrolled ? "#1a1a1a" : "rgba(255,255,255,0.15)",
                color: scrolled ? "#FAF8F5" : "#fff",
                border: scrolled ? "1px solid #1a1a1a" : "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Call Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-500 ${scrolled ? "text-[#1a1a1a]" : "text-white"}`}
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
                {[
                  { href: "#about", label: "About" },
                  { href: "#menu", label: "Menu" },
                  { href: "#space", label: "The Space" },
                  { href: "#visit", label: "Visit" },
                  { href: "https://www.instagram.com/babygirl.atl/", label: "Instagram", external: true },
                ].map((link) => (
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
                <a href="tel:+14045499692" className="mt-2 py-3 text-[16px] font-medium text-[#9a8c5a]">
                  Call (404) 549-9692
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} id="top" className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/interior-stained-glass.png"
            alt="Babygirl interior — stained glass windows casting warm light"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)" }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative px-6 sm:px-10 pb-16 sm:pb-24 pt-32 max-w-[1400px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[clamp(12px,1vw,14px)] font-normal text-white/60 tracking-[0.2em] uppercase mb-4 sm:mb-6"
          >
            East Lake, Atlanta &middot; Est. 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-display text-[clamp(56px,10vw,140px)] font-light leading-[0.9] tracking-[-0.04em] text-white mb-6 sm:mb-8 text-glow"
          >
            babygirl
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[clamp(16px,1.6vw,22px)] font-light text-white/80 max-w-[560px] leading-[1.5]"
          >
            A calming neighborhood diner. <span className="text-key-light">Coffee early</span>,
            food all day, lights low when evening comes.
          </motion.p>

          {/* Rating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center gap-4 mt-8 sm:mt-10"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-[14px] ${i < 4 ? "text-[#C5D63D]" : "text-[#C5D63D]/50"}`}>&#9733;</span>
                ))}
              </div>
              <span className="text-[13px] text-white/80 font-medium">4.5</span>
              <span className="text-[12px] text-white/50">on Google</span>
            </div>
            <span className="text-[13px] text-white/40">Walk-ins only</span>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            <a href="tel:+14045499692" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1a1a1a] text-[14px] font-medium hover:bg-[#C5D63D] transition-colors duration-300">
              Call to Visit
            </a>
            <a href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-[14px] font-medium hover:bg-white/10 transition-colors duration-300">
              Get Directions
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* ─── About ────────────────────────────────────────── */}
      <section id="about" className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 10vw, 160px)", paddingBottom: "clamp(64px, 8vw, 120px)" }}>
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal>
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8a8580] mb-6">About</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif-display text-[clamp(32px,4vw,56px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-6">
              Good food. <span className="text-gold">Real vibes.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-[#4a4540] max-w-[680px] mx-auto mb-6">
              Babygirl is what happens when a <span className="text-key">Michelin-recognized chef</span> builds
              a restaurant for his neighborhood instead of a dining guide. Chef Hudson Rouse wanted
              a place where East Lake could <span className="text-key">sit down, eat well, and not think too hard about it.</span>
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] text-[#4a4540] max-w-[680px] mx-auto">
              Three-ingredient biscuits. <span className="text-gold">Single-varietal coffee.</span> Riverview Farms beef.
              Everything here is intentional, nothing is fussy. Named after his two daughters —
              because <span className="text-amber font-medium">some things are just personal like that.</span>
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10">
              {["Michelin-recognized chef", "Farm-to-table", "Seasonal menu", "Natural wine", "Free parking"].map((tag) => (
                <span key={tag} className="px-4 py-2 text-[11px] sm:text-[12px] font-medium tracking-[0.05em] text-[#5a5550] border border-[#ddd6ce] rounded-full bg-[#f5f0ea]">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Photo break ──────────────────────────────────── */}
      <section className="px-6 sm:px-10 pb-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { src: "/images/hero-spread.jpg", alt: "Chicken and waffles with braised greens, granola yogurt bowl" },
              { src: "/images/waffle-window.png", alt: "Belgian waffle with strawberries in golden stained glass light" },
              { src: "/images/salmon-egg-bowl.png", alt: "Smoked salmon and fried egg over hashbrowns" },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 0.1}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Menu ─────────────────────────────────────────── */}
      <section id="menu" className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 10vw, 160px)", paddingBottom: "clamp(64px, 8vw, 120px)" }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Menu header — centered */}
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8a8580] mb-4">Menu</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif-display text-[clamp(28px,4vw,52px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-4">
                Signature Plates
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-[clamp(14px,1.1vw,16px)] font-light text-[#8a8580] max-w-[460px] mx-auto mb-8">
                <span className="text-key">Vegetable-forward plates</span>, Southern comfort, and everything in between.
                The menu moves with the seasons.
              </p>
            </Reveal>

            {/* Tabs */}
            <Reveal delay={0.2}>
              <div className="flex flex-wrap justify-center gap-2">
                {([
                  { key: "brunch", label: "Brunch", note: "Sat & Sun" },
                  { key: "pm", label: "P.M. Menu", note: "Mon — Fri" },
                  { key: "drinks", label: "Drinks", note: "All day" },
                ] as const).map(({ key, label, note }) => (
                  <button
                    key={key}
                    onClick={() => setMenuTab(key)}
                    className="menu-tab-btn px-5 py-3 text-[14px] sm:text-[13px] font-medium rounded-full min-h-[48px] sm:min-h-0 sm:py-2.5"
                    style={{
                      background: menuTab === key ? "#1a1a1a" : "transparent",
                      color: menuTab === key ? "#FAF8F5" : "#8a8580",
                      border: menuTab === key ? "1px solid #1a1a1a" : "1px solid #ddd6ce",
                    }}
                  >
                    {label}
                    <span className="hidden sm:inline text-[11px] ml-1.5 opacity-60">({note})</span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Menu grid — cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={menuTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {activeMenu.map((item, i) => (
                <MenuCard key={item.name} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Full-width interior break ────────────────────── */}
      <section id="space" className="relative">
        <Reveal>
          <div className="aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
            <img
              src="/images/interior-stained-glass.png"
              alt="Floor-to-ceiling stained glass panels casting warm light across the dining room"
              className="w-full h-full object-cover object-[center_40%]"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <h2 className="font-serif-display text-[clamp(28px,5vw,64px)] font-light text-white tracking-[-0.03em] mb-4">
                  Light Through <span className="text-[#C5D63D]">Stained Glass</span>
                </h2>
                <p className="text-[clamp(14px,1.2vw,18px)] text-white/70 font-light max-w-[500px] mx-auto">
                  Designed by Claudhaus. Danish-Japanese sensibility. 60 seats inside, 30 on the patio.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── Reviews Marquee ──────────────────────────────── */}
      <section className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 10vw, 140px)", paddingBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8a8580] mb-4">Reviews</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif-display text-[clamp(24px,3vw,40px)] font-light text-[#1a1a1a] tracking-[-0.02em]">
                What the <span className="text-gold">neighborhood</span> is saying
              </h2>
            </Reveal>
          </div>
          <ReviewMarquee />
        </div>
      </section>

      {/* ─── Neighborhood + Visit ─────────────────────────── */}
      <section id="visit" className="px-6 sm:px-10" style={{ paddingTop: "clamp(64px, 8vw, 120px)", paddingBottom: "clamp(80px, 10vw, 160px)", background: "#f0ece7" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
            {/* Left — info */}
            <div>
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8a8580] mb-6">Visit</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-serif-display text-[clamp(28px,3.5vw,48px)] font-light leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-4">
                  Pull up. <span className="text-gold">We saved you a seat.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] text-[#8a8580] mb-10 max-w-[420px]">
                  <span className="text-key">Walk-ins only.</span> No reservations, no pretense.
                  Just show up and let us feed you.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#8a8580] mb-3">Address</p>
                    <a href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317" target="_blank" rel="noopener noreferrer" className="text-[16px] font-light text-[#1a1a1a] leading-relaxed hover:text-[#9a8c5a] transition-colors">
                      2371 Hosea L. Williams Dr SE<br />Suite C, Atlanta, GA 30317
                    </a>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#8a8580] mb-3">Hours</p>
                    {HOURS.map((h) => (
                      <div key={h.day} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between max-w-[400px] py-3 border-b border-[#ddd6ce]">
                        <span className="text-[15px] font-medium text-[#1a1a1a]">{h.day}</span>
                        <div className="flex items-baseline gap-3 mt-1 sm:mt-0">
                          <span className="text-[15px] font-light text-[#5a5550]">{h.time}</span>
                          {h.note && <span className="text-[11px] text-[#9a8c5a] font-medium tracking-[0.05em]">{h.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a href="tel:+14045499692" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full bg-[#1a1a1a] text-white text-[14px] font-medium hover:bg-[#2a2520] transition-colors min-h-[48px]">
                      Call (404) 549-9692
                    </a>
                    <a href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full border border-[#1a1a1a] text-[#1a1a1a] text-[14px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-all min-h-[48px]">
                      Get Directions
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — building photo + map */}
            <div className="space-y-4">
              <Reveal delay={0.2}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img src="/images/exterior-building.jpg" alt="Babygirl exterior — black brick building in East Lake" className="w-full h-full object-cover" />
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#e8e4df] relative">
                  <iframe
                    title="Babygirl location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.1!2d-84.3117!3d33.7508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5044e1c324e5d%3A0x2371!2s2371+Hosea+L+Williams+Dr+SE%2C+Atlanta%2C+GA+30317!5e0!3m2!1sen!2sus!4v1"
                    className="absolute inset-0 w-full h-full border-0 opacity-80"
                    style={{ filter: "saturate(0.3) contrast(1.1)" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="relative px-6 sm:px-10 py-16 sm:py-20 overflow-hidden" style={{ background: "#1a1a1a" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(197,214,61,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(154,140,90,0.05) 0%, transparent 40%)"
        }} />
        <div className="max-w-[1400px] mx-auto relative">
          <div className="text-center mb-12">
            <p className="font-serif-display text-[clamp(36px,5vw,64px)] font-light tracking-[-0.03em] text-white leading-[1]">babygirl</p>
            <p className="text-[14px] text-white/40 mt-3">All day dining &middot; Cafe &middot; Restaurant &middot; Bar</p>
            <p className="text-[13px] text-white/25 mt-2 italic">A neighborhood spot. Named after his daughters.</p>
          </div>

          <div className="h-[1px] bg-white/10 mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[13px] text-white/30">2371 Hosea L. Williams Dr SE, Suite C, Atlanta, GA 30317</p>
            <div className="flex items-center gap-6 text-[13px] text-white/40">
              <a href="https://www.instagram.com/babygirl.atl/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://maps.google.com/?q=2371+Hosea+L+Williams+Dr+SE+Atlanta+GA+30317" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Directions</a>
              <a href="tel:+14045499692" className="text-[#C5D63D] hover:text-white transition-colors">(404) 549-9692</a>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-[11px] text-white/15 tracking-[0.1em] uppercase">East Lake, Atlanta &middot; Est. 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

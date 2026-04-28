import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useNavigate } from "react-router";
import { Moon, Sun, X, Menu, ArrowRight, Brain, BarChart3, MapPin, Link, AlertTriangle,
  Car, Shirt, ShoppingCart, Pill, Package, Cpu,
  Truck, Warehouse, Mail, Phone, MapPinned, 
  Linkedin, Twitter, Instagram, Globe, Zap, Settings, ShieldCheck, ChevronDown
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ToggleTheme } from "../components/ui/toggle-theme";
import { InteractiveGlobe } from "../components/ui/globe";

/* ═══════════════════════════════════════
   BRAND COLORS — Futuristic Dark
   ═══════════════════════════════════════ */
const C = {
  primary:     "#8B004A",
  primaryDark: "#6B0039",
  primaryLight:"#C4006A",
  bgBlack:     "#000000",
  textWhite:   "#FFFFFF",
  textGray:    "#a1a1aa",
  gradient:    "linear-gradient(135deg, #8B004A, #C4006A)",
};

/* ═══════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════ */

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Features", id: "features" },
    { name: "Industries", id: "industries" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "py-4 border-b border-border shadow-sm bg-background/90 backdrop-blur-xl" : "py-6 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img 
            src="/vama-logo.png" 
            alt="VAMA Logo" 
            className={`h-10 w-auto object-contain transition-all duration-300 ${isDark ? "invert brightness-200" : "mix-blend-multiply"}`} 
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="nav-link text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {link.name}
            </button>
          ))}
          <ToggleTheme />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/select-role")}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ToggleTheme />
          <button className="text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)} className="nav-link text-left text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => navigate("/select-role")}
                className="w-full py-4 rounded-xl font-bold text-primary-foreground mt-2 shadow-md transition-all duration-300 bg-primary hover:bg-primary/90"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-background px-6 pt-24 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "32px 32px"
        }}
      />
      
      <div className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8 mt-12 md:mt-0">
        {/* LEFT SIDE CONTENT */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex-1 text-center md:text-left flex flex-col items-center md:items-start"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-[#D7340B] animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">AI-Powered Logistics</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight text-foreground leading-[1.05] mb-6">
            Smart Supply Chain.<br />
            <span className="text-primary">Simplified.</span>
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            Harness AI-driven demand prediction, real-time shipment tracking, and intelligent inventory optimization to streamline your supply chain.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-14">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/select-role")}
              className="py-4 px-8 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90"
            >
              Get Started
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="py-4 px-8 rounded-2xl font-bold text-lg text-muted-foreground bg-card border border-border shadow-sm hover:bg-accent transition-all"
            >
              Learn More
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 md:gap-12 pt-8 border-t border-border w-full justify-center md:justify-start">
            <div className="flex flex-col text-center md:text-left">
              <span className="text-3xl font-black text-foreground">10K+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Businesses</span>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex flex-col text-center md:text-left">
              <span className="text-3xl font-black text-foreground">1M+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Deliveries</span>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex flex-col text-center md:text-left">
              <span className="text-3xl font-black text-foreground">99%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Uptime</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE VISUAL */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="flex-1 w-full flex justify-center items-center relative min-h-[400px] md:min-h-[500px]"
        >
          {/* Main Center Icon */}
          <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-card shadow-2xl flex items-center justify-center border border-border">
            <Truck className="w-12 h-12 md:w-16 md:h-16 text-primary" />
          </div>

          {/* Orbiting / Floating Icons */}
          {/* 1. Warehouse */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 md:left-24 w-14 h-14 md:w-16 md:h-16 bg-card rounded-2xl shadow-xl flex items-center justify-center border border-gray-50"
          >
            <Warehouse className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          </motion.div>

          {/* 2. Analytics */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-20 right-8 md:right-20 w-12 h-12 md:w-14 md:h-14 bg-card rounded-2xl shadow-xl flex items-center justify-center border border-gray-50"
          >
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
          </motion.div>

          {/* 3. Delivery */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-16 right-10 md:right-24 w-14 h-14 md:w-16 md:h-16 bg-card rounded-2xl shadow-xl flex items-center justify-center border border-gray-50"
          >
            <Package className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
          </motion.div>

          {/* 4. Location */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-8 left-14 md:left-28 w-12 h-12 md:w-14 md:h-14 bg-card rounded-2xl shadow-xl flex items-center justify-center border border-gray-50"
          >
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
          </motion.div>

          {/* Soft decorative background circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D7340B]/5 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-[60px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

const VisionSection = () => {
  return (
    <section className="py-24 bg-card px-6 border-t border-border">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Our Vision
          </span>
        </div>
        
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6">
          Building smarter logistics for a faster world
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-16">
          VAMA is reimagining supply chains from the ground up — using AI to predict demand, eliminate waste, and deliver results. From warehouse to doorstep, we optimize every mile.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: "10,000+", label: "Businesses" },
            { value: "1M+", label: "Deliveries Optimized" },
            { value: "99%", label: "Efficiency Goal" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-background rounded-[2rem] p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col justify-center items-center"
            >
              <h3 className="text-5xl md:text-6xl font-black text-primary mb-3">{stat.value}</h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: Brain, title: "AI Demand Prediction", desc: "Forecast demand patterns using machine learning to prevent overstocking and stockouts." },
    { icon: BarChart3, title: "Smart Inventory Tracking", desc: "Real-time inventory visibility across all warehouses with automated reorder points." },
    { icon: MapPin, title: "Real-time Shipment Tracking", desc: "Track every shipment from origin to destination with live GPS and ETA updates." },
    { icon: Link, title: "Warehouse–Supplier Link", desc: "Seamlessly connect suppliers and warehouses for faster procurement cycles." },
    { icon: AlertTriangle, title: "Delay Detection & Reasons", desc: "Automatically detect shipment delays and surface root causes with AI analysis." },
  ];

  return (
    <section id="features" className="py-24 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground">What Makes Us Different</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-card rounded-[2rem] p-8 shadow-sm hover:shadow-xl border border-border transition-all duration-300 flex flex-col items-start min-h-[220px]"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-accent border border-border">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const GlobalReach = () => {
  return (
    <section id="industries" className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Universal Connectivity</span>
            <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight mb-8">
              A Network That Never Sleeps
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              VAMA is designed to handle the complexity of global trade. From heavy manufacturing to high-velocity e-commerce, our platform adapts to your specific logic.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-black text-foreground mb-1">99.9%</h4>
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Uptime Reliability</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-foreground mb-1">&lt; 150ms</h4>
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Latency Response</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <InteractiveGlobe />
          </div>
        </div>
      </div>
    </section>
  );
};

const indData = [
  { name: "Automobile", icon: Car },
  { name: "Textile", icon: Shirt },
  { name: "E-commerce", icon: ShoppingCart },
  { name: "Pharmaceutical", icon: Pill },
  { name: "FMCG", icon: Package },
  { name: "Electronics", icon: Cpu }
];

const IndustriesSection = () => {
  return (
    <section className="py-24 bg-background px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Industries</span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground">Industries We Serve</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {indData.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.04, y: -5 }}
                className="group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{ind.name}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const faqs = [
  { question: "How does VAMA work?", answer: "VAMA offers a holistic, AI-driven logistics ecosystem. It unites warehouse managers, drivers, and consumers around real-time visibility and optimized routing to prevent delays before they happen." },
  { question: "Is this platform AI-based?", answer: "Yes, our core predictive analytics feature uses neural networks to analyze delivery constraints, weather, and traffic data to generate perfect logistical paths automatically." },
  { question: "Who can use this system?", answer: "VAMA is tailored for the entire supply chain network. We distribute unique, powerful dashboards for Warehouse Managers, Suppliers, Transport Drivers, Delivery Personnel, and end-consumers." },
  { question: "Is it useful for small businesses?", answer: "Absolutely. Our tools are seamlessly scalable. Whether you're tracking ten shipments locally or ten thousand deliveries continent-wide, VAMA provides equal clarity." },
  { question: "How secure is my data?", answer: "We deploy blockchain-verified, tamper-proof tracking nodes across the network, ensuring complete supply chain integrity from creation to delivery." }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-background px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-card rounded-2xl border transition-all duration-300 shadow-sm ${isOpen ? "border-primary/30 shadow-md" : "border-border"}`}
              >
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-6 flex items-center justify-between outline-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#8B004A]"
                >
                  <span className={`text-lg font-bold pr-8 transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-primary/10" : "bg-accent"}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-gray-400"}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed text-sm md:text-base border-t border-border mx-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer id="contact" className="bg-[#000000] pt-32 pb-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate("/")}>
              <img 
                src="/vama-logo.png" 
                alt="VAMA Logo" 
                className="h-8 w-auto object-contain invert brightness-200 mix-blend-screen" 
              />
            </div>
            <p className="text-[#E5E7EB] text-sm leading-relaxed mb-8 max-w-xs">
              Pioneering the future of autonomous supply chain management with AI and real-time connectivity.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-card/5 border border-white/10 shadow-sm flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all group">
                  <Icon size={18} className="group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Platform</h4>
            <div className="flex flex-col gap-4">
              {["Features", "Industries", "Optimization", "Security"].map(item => (
                <button key={item} className="text-left text-sm text-[#E5E7EB] hover:text-primary transition-colors">{item}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Company</h4>
            <div className="flex flex-col gap-4">
              {["About Us", "Careers", "Contact", "Privacy"].map(item => (
                <button key={item} className="text-left text-sm text-[#E5E7EB] hover:text-primary transition-colors">{item}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Reach Out</h4>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-card/5 border border-white/10 flex items-center justify-center group hover:bg-primary/10 transition-all">
                  <Mail size={18} className="text-white group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Email Us</p>
                  <p className="text-[#E5E7EB] text-xs">hello@vama.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-card/5 border border-white/10 flex items-center justify-center group hover:bg-primary/10 transition-all">
                  <MapPinned size={18} className="text-white group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Location</p>
                  <p className="text-[#E5E7EB] text-xs">Global HQ, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#E5E7EB] text-xs">© {new Date().getFullYear()} VAMA Industries. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-[#E5E7EB]">
            <button className="hover:text-primary transition-colors">Terms of Service</button>
            <button className="hover:text-primary transition-colors">Security Audit</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function VamaLanding() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <VisionSection />
      <FeaturesSection />
      <GlobalReach />
      <IndustriesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

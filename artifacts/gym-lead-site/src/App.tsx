import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, Check, ChevronDown, Clock3, Dumbbell, Instagram, Menu, MoveUpRight, Play, Quote, ShieldCheck, Sparkles, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const classes = [
  { id: '01', name: 'FONDATIONS', type: 'Force', time: 'Lun / Mer / Ven · 6 h 15', note: 'Apprendre les mouvements. Créer l’habitude.', level: 'Pour commencer', color: 'orange' },
  { id: '02', name: 'SALLE DES MACHINES', type: 'Conditionnement', time: 'Mar / Jeu · 19 h 00', note: 'Développer votre capacité, sans ego.', level: 'Tous niveaux', color: 'lime' },
  { id: '03', name: 'CLUB HALTÈRES', type: 'Force', time: 'Sam · 9 h 00', note: 'Une heure concentrée sous la barre.', level: 'Progression', color: 'stone' },
];

const faqs = [
  ['Je n’ai jamais fait de sport. IRONHALL est-il fait pour moi ?', 'Absolument. Fondations est conçu pour celles et ceux qui commencent là où ils sont, pas là où ils pensent devoir être. Votre coach vous accueillera, découvrira votre parcours et vous aidera à obtenir une première victoire concrète.'],
  ['Que comprend l’essai gratuit de 7 jours ?', 'Vous bénéficiez d’un accès illimité à nos séances collectives pendant sept jours, ainsi que d’un rendez-vous individuel pour définir vos objectifs avec un coach. Pas de vente forcée, pas de visite gênante. Une vraie première rencontre avec la salle.'],
  ['Dois-je déjà être en forme pour m’inscrire ?', 'Non. La forme est le résultat, pas une condition d’entrée. Nous adaptons chaque mouvement, chaque charge et chaque rythme pour que vous puissiez vous entraîner sérieusement, sans avoir à prouver quoi que ce soit.'],
  ['Où se trouve la salle et quels sont vos horaires ?', 'Vous nous trouverez au 14 Mercer Street, juste à côté de la rue principale. La salle est ouverte de 5 h 30 à 21 h en semaine, et le samedi de 8 h à 14 h.'],
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${light ? 'text-[#e8e0d1]' : 'text-[#24231f]'}`} data-testid="link-logo">
      <span className="flex h-8 w-8 items-center justify-center bg-[#f04d23] text-[#e8e0d1]"><Dumbbell size={17} strokeWidth={2.6} /></span>
      <span className="font-display text-[24px] font-black tracking-[.04em] leading-none">IRONHALL</span>
    </a>
  );
}

function Header({ onTrial }: { onTrial: () => void }) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo light />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          <button onClick={() => go('method')} className="font-mono-custom text-[10px] tracking-[.18em] text-[#c0b9ac] transition-colors hover:text-[#d9e66c]" data-testid="link-method">LA MÉTHODE</button>
          <button onClick={() => go('classes')} className="font-mono-custom text-[10px] tracking-[.18em] text-[#c0b9ac] transition-colors hover:text-[#d9e66c]" data-testid="link-classes">COURS</button>
          <button onClick={() => go('voices')} className="font-mono-custom text-[10px] tracking-[.18em] text-[#c0b9ac] transition-colors hover:text-[#d9e66c]" data-testid="link-stories">TÉMOIGNAGES</button>
        </nav>
        <button onClick={onTrial} className="hidden items-center gap-3 bg-[#d9e66c] px-4 py-3 font-mono-custom text-[10px] font-medium tracking-[.12em] text-[#24231f] transition-transform hover:-translate-y-0.5 md:flex" data-testid="button-header-trial">
          RÉSERVEZ VOS 7 JOURS <ArrowRight size={14} />
        </button>
        <button onClick={() => setOpen(!open)} className="text-[#e8e0d1] md:hidden" aria-label="Ouvrir la navigation" data-testid="button-mobile-menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && <div className="mx-4 border border-[#4e4d47] bg-[#171816] p-5 md:hidden">
        <div className="flex flex-col gap-5">
          <button onClick={() => go('method')} className="text-left font-mono-custom text-[11px] tracking-[.16em] text-[#e8e0d1]" data-testid="link-mobile-method">LA MÉTHODE</button>
          <button onClick={() => go('classes')} className="text-left font-mono-custom text-[11px] tracking-[.16em] text-[#e8e0d1]" data-testid="link-mobile-classes">COURS</button>
          <button onClick={() => go('voices')} className="text-left font-mono-custom text-[11px] tracking-[.16em] text-[#e8e0d1]" data-testid="link-mobile-stories">TÉMOIGNAGES</button>
          <button onClick={() => { setOpen(false); onTrial(); }} className="flex items-center justify-between bg-[#f04d23] px-4 py-3 text-left font-mono-custom text-[11px] tracking-[.12em] text-[#e8e0d1]" data-testid="button-mobile-trial">RÉSERVEZ VOS 7 JOURS <ArrowRight size={14} /></button>
        </div>
      </div>}
    </header>
  );
}

function Hero({ onTrial }: { onTrial: () => void }) {
  return (
    <section id="top" className="noise relative min-h-[720px] overflow-hidden bg-[#24231f] text-[#e8e0d1]">
      <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(90deg, rgba(36,35,31,.96) 0%, rgba(36,35,31,.7) 46%, rgba(36,35,31,.2) 100%), url('https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1800')" , backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute right-[-12%] top-[20%] h-[480px] w-[480px] rounded-full border border-[#d9e66c]/20 sm:right-[4%] sm:top-[15%]" />
       <div className="relative mx-auto flex min-h-[720px] max-w-[1280px] items-end px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-24">
        <div className="max-w-[760px]">
           <Reveal><div className="mb-5 flex items-center gap-3 font-mono-custom text-[10px] tracking-[.2em] text-[#d9e66c]"><span className="h-px w-9 bg-[#d9e66c]" /> MERCER STREET · DEPUIS 2014</div></Reveal>
           <Reveal className="delay-1"><h1 className="font-display text-[clamp(3rem,14vw,10.8rem)] font-black uppercase leading-[.78] tracking-[-.045em]">Ça<br /><span className="text-[#f04d23]">commence</span><br />ici.</h1></Reveal>
           <Reveal className="delay-2"><div className="mt-8 flex max-w-[570px] flex-col justify-between gap-7 sm:flex-row sm:items-end"><p className="max-w-[340px] text-[14px] leading-6 text-[#c0b9ac]">Une salle de force et de conditionnement pour celles et ceux qui veulent faire du sport une habitude — pas une promesse de plus.</p><button onClick={onTrial} className="group flex shrink-0 items-center gap-3 self-start bg-[#f04d23] px-5 py-4 font-mono-custom text-[11px] tracking-[.12em] text-[#e8e0d1] transition-all hover:bg-[#ff6338] hover:pl-7" data-testid="button-hero-trial">COMMENCER AVEC 7 JOURS <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button></div></Reveal>
        </div>
       <div className="absolute bottom-6 right-6 hidden items-center gap-3 lg:flex"><span className="font-mono-custom text-[9px] tracking-[.16em] text-[#9d9a91]">DÉCOUVREZ VOTRE SALLE</span><ArrowDownRight size={18} className="text-[#d9e66c]" /></div>
      </div>
       <div className="absolute bottom-0 right-0 hidden h-20 w-[27%] bg-[#d9e66c] p-5 text-[#24231f] lg:block"><div className="font-display text-2xl font-bold leading-none">7 JOURS OFFERTS</div><div className="mt-2 font-mono-custom text-[9px] tracking-[.13em]">+ UN BILAN AVEC UN COACH</div></div>
    </section>
  );
}

function Ticker() {
  return <div className="overflow-hidden border-b border-[#3b3a35] bg-[#171816] text-[#e8e0d1]"><div className="flex min-w-max animate-[ticker_26s_linear_infinite] items-center gap-10 py-3 font-mono-custom text-[10px] tracking-[.16em] text-[#9d9a91]"><span>BOUGEZ</span><span className="text-[#f04d23]">✦</span><span>BOUGEZ BIEN</span><span className="text-[#d9e66c]">✦</span><span>DEVENEZ PLUS FORT</span><span className="text-[#f04d23]">✦</span><span>BOUGEZ</span><span className="text-[#d9e66c]">✦</span><span>BOUGEZ BIEN</span><span className="text-[#f04d23]">✦</span><span>DEVENEZ PLUS FORT</span><span className="text-[#d9e66c]">✦</span><span>BOUGEZ</span><span className="text-[#f04d23]">✦</span></div></div>;
}

function Method() {
  const ref = useReveal();
  return <section id="method" className="bg-[#e8e0d1] px-5 py-20 text-[#24231f] sm:px-8 sm:py-28 lg:px-12">
    <div ref={ref} className="reveal mx-auto max-w-[1280px]">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div><div className="font-mono-custom text-[10px] tracking-[.18em] text-[#f04d23]">01 / LA MÉTHODE</div><h2 className="mt-6 max-w-[440px] font-display text-[clamp(3.4rem,7vw,6.7rem)] font-black uppercase leading-[.82] tracking-[-.035em]">S’entraîner<br /><span className="text-[#f04d23]">pour la vie.</span></h2></div>
        <div className="pt-1 lg:pt-12"><p className="max-w-[620px] text-[19px] font-medium leading-8">Le plan est simple : venir, faire le travail, repartir meilleur qu’à l’arrivée. Nos coachs apportent la structure et les exigences. Vous apportez l’heure qui vient.</p><div className="mt-14 grid gap-0 border-t border-[#bdb5a5] sm:grid-cols-3">
          {[['01', 'COACHING', 'Chaque séance a un objectif. Chaque personne a un plan.'], ['02', 'COMMUNAUTÉ', 'Assez petit pour connaître votre prénom. Assez fort pour vous tirer vers le haut.'], ['03', 'PROGRÈS', 'Nous suivons le travail pour que vous voyiez la personne qu’il construit.']].map(([num, title, copy], i) => <div key={num} className={`border-b border-[#bdb5a5] py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 ${i === 2 ? 'sm:border-r-0' : ''}`}><div className="font-mono-custom text-[10px] text-[#f04d23]">{num}</div><h3 className="mt-5 font-display text-[29px] font-bold">{title}</h3><p className="mt-2 max-w-[180px] text-[12px] leading-5 text-[#5f5b53]">{copy}</p></div>)}
        </div></div>
      </div>
    </div>
  </section>;
}

function Classes() {
  const [active, setActive] = useState('Tous');
  const filters = ['Tous', 'Force', 'Conditionnement'];
  const list = active === 'Tous' ? classes : classes.filter(item => item.type === active);
  return <section id="classes" className="texture-grid bg-[#24231f] px-5 py-20 text-[#e8e0d1] sm:px-8 sm:py-28 lg:px-12">
    <div className="mx-auto max-w-[1280px]">
      <Reveal><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="font-mono-custom text-[10px] tracking-[.18em] text-[#d9e66c]">02 / CHOISISSEZ VOTRE COURS</div><h2 className="mt-5 font-display text-[clamp(3.3rem,7vw,6.7rem)] font-black uppercase leading-[.82] tracking-[-.035em]">Un entraînement<br /><span className="text-[#d9e66c]">qui vous ressemble.</span></h2></div><div className="flex gap-2">{filters.map(filter => <button key={filter} onClick={() => setActive(filter)} className={`border px-4 py-3 font-mono-custom text-[10px] tracking-[.12em] transition-colors ${active === filter ? 'border-[#d9e66c] bg-[#d9e66c] text-[#24231f]' : 'border-[#5a5951] text-[#b7b1a6] hover:border-[#d9e66c] hover:text-[#d9e66c]'}`} data-testid={`button-filter-${filter.toLowerCase()}`}>{filter}</button>)}</div></div></Reveal>
      <div className="mt-14 border-t border-[#515049]">{list.map((item, index) => <Reveal key={item.id} className={`delay-${Math.min(index + 1, 3)}`}><article className="group grid gap-5 border-b border-[#515049] py-7 md:grid-cols-[70px_1fr_1fr_160px] md:items-center"><div className="font-mono-custom text-[11px] text-[#f04d23]">{item.id}</div><div><div className="flex items-center gap-3"><h3 className="font-display text-4xl font-bold tracking-wide transition-colors group-hover:text-[#d9e66c]">{item.name}</h3><span className={`h-2 w-2 rounded-full ${item.color === 'orange' ? 'bg-[#f04d23]' : item.color === 'lime' ? 'bg-[#d9e66c]' : 'bg-[#8f8b83]'}`} /></div><div className="mt-1 font-mono-custom text-[9px] tracking-[.16em] text-[#89877f]">{item.type.toUpperCase()} · {item.level.toUpperCase()}</div></div><div><div className="flex items-center gap-2 font-mono-custom text-[11px] text-[#c0b9ac]"><Clock3 size={14} className="text-[#d9e66c]" /> {item.time}</div><p className="mt-2 text-[13px] text-[#89877f]">{item.note}</p></div><button onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 font-mono-custom text-[10px] tracking-[.14em] text-[#d9e66c] transition-all group-hover:gap-4 md:justify-end" data-testid={`button-class-${item.id}`}>ESSAYER CE COURS <ArrowRight size={14} /></button></article></Reveal>)}</div>
      <div className="mt-8 flex items-center gap-3 font-mono-custom text-[10px] tracking-[.14em] text-[#89877f]"><ShieldCheck size={15} className="text-[#d9e66c]" /> Toutes les séances sont encadrées, adaptées et accessibles aux débutants.</div>
    </div>
  </section>;
}

function Proof() {
  return <section className="bg-[#f04d23] px-5 py-16 text-[#24231f] sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_2fr] lg:items-center"><Reveal><div><div className="font-mono-custom text-[10px] tracking-[.16em]">LES CHIFFRES, SANS LE BRUIT</div><p className="mt-5 max-w-[250px] text-[14px] leading-6">Une bonne salle rend les progrès impossibles à ignorer.</p></div></Reveal><div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">{[['11', 'ANS D’OUVERTURE'], ['4,9', 'NOTE LOCALE'], ['83', 'SÉANCES PAR SEMAINE'], ['1 240', 'MEMBRES PLUS FORTS']].map(([number, label], i) => <Reveal key={label} className={`delay-${Math.min(i + 1, 3)}`}><div className="border-l border-[#24231f]/25 pl-4"><div className="font-display text-5xl font-black leading-none sm:text-6xl">{number}</div><div className="mt-3 font-mono-custom text-[9px] tracking-[.14em]">{label}</div></div></Reveal>)}</div></div></section>;
}

function Story() {
  return <section id="voices" className="bg-[#e8e0d1] px-5 py-20 text-[#24231f] sm:px-8 sm:py-28 lg:px-12"><div className="mx-auto max-w-[1280px]"><div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-24"><Reveal><div className="relative min-h-[480px] overflow-hidden bg-[#777970]"><img src="https://images.pexels.com/photos/4164510/pexels-photo-4164510.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Une athlète s’entraîne avec un coach chez IRONHALL" className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.15] mix-blend-multiply" /><div className="absolute inset-0 bg-[#f04d23]/20 mix-blend-color" /><div className="absolute left-5 top-5 bg-[#d9e66c] px-3 py-2 font-mono-custom text-[9px] tracking-[.14em]">DES PERSONNES. DU TRAVAIL.</div><div className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8e0d1]/60 text-[#e8e0d1]"><Play size={18} fill="currentColor" /></div></div></Reveal><Reveal className="delay-1 flex flex-col justify-center"><div className="font-mono-custom text-[10px] tracking-[.18em] text-[#f04d23]">03 / PAROLE DE MEMBRE</div><Quote className="mt-8 text-[#f04d23]" size={38} strokeWidth={1.3} /><blockquote className="mt-5 font-display text-[clamp(2.5rem,5vw,4.6rem)] font-bold uppercase leading-[.9] tracking-[-.02em]">« J’ai arrêté d’attendre la motivation. Je sais simplement où je vais, le mardi. »</blockquote><div className="mt-8 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center bg-[#24231f] font-display text-lg font-bold text-[#d9e66c]">MT</div><div><div className="text-[12px] font-bold">Maya T.</div><div className="font-mono-custom text-[9px] tracking-[.12em] text-[#6e6b63]">MEMBRE DEPUIS 2021 · 14 MERCER ST</div></div></div></Reveal></div></div></section>;
}

function Visit() {
  return <section className="bg-[#171816] px-5 py-20 text-[#e8e0d1] sm:px-8 sm:py-28 lg:px-12"><div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.85fr_1.15fr]"><Reveal><div><div className="font-mono-custom text-[10px] tracking-[.18em] text-[#d9e66c]">04 / VOTRE PREMIÈRE SEMAINE</div><h2 className="mt-5 max-w-[420px] font-display text-[clamp(3.4rem,7vw,6.7rem)] font-black uppercase leading-[.82]">Pas de<br /><span className="text-[#f04d23]">promesse.</span><br />Juste un début.</h2></div></Reveal><div className="border-t border-[#4b4b45]">{[['01', 'Dites-nous où vous en êtes', 'Un échange rapide sur vos objectifs, votre rythme et ce qui a rendu l’entraînement difficile jusqu’ici.'], ['02', 'Rencontrez votre coach', 'Nous vous orientons vers le bon point de départ et vous faisons découvrir la salle, sans argumentaire commercial.'], ['03', 'Faites votre première semaine', 'Sept jours de séances encadrées, puis un plan clair pour continuer sur votre lancée.']].map(([num, title, copy], i) => <Reveal key={num} className={`delay-${i + 1}`}><div className="grid gap-4 border-b border-[#4b4b45] py-7 sm:grid-cols-[55px_1fr]"><div className="font-mono-custom text-[11px] text-[#f04d23]">{num}</div><div><h3 className="font-display text-3xl font-bold">{title}</h3><p className="mt-2 max-w-[470px] text-[13px] leading-6 text-[#aaa69d]">{copy}</p></div></div></Reveal>)}</div></div></section>;
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="bg-[#d9e66c] px-5 py-20 text-[#24231f] sm:px-8 sm:py-28 lg:px-12"><div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.75fr_1.25fr]"><Reveal><div><div className="font-mono-custom text-[10px] tracking-[.18em]">05 / VOS QUESTIONS</div><h2 className="mt-5 font-display text-[clamp(3.6rem,7vw,6.7rem)] font-black uppercase leading-[.82]">Pas de<br />barrière<br /><span className="text-[#f04d23]">ici.</span></h2><p className="mt-8 max-w-[260px] text-[13px] leading-6">Vous vous demandez encore si cette salle est faite pour vous ? Posez-nous vos vraies questions.</p></div></Reveal><div className="border-t border-[#24231f]/30">{faqs.map(([question, answer], i) => <div key={question} className="border-b border-[#24231f]/30"><button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-5 py-6 text-left font-display text-[23px] font-bold" data-testid={`button-faq-${i}`}><span>{question}</span><ChevronDown size={20} className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} /></button><div className={`grid transition-[grid-template-rows] duration-300 ${open === i ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}><div className="overflow-hidden text-[13px] leading-6 text-[#46463c]">{answer}</div></div></div>)}</div></div></section>;
}

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); window.setTimeout(() => { setBusy(false); setSubmitted(true); }, 750); };
  return <section id="lead-form" className="noise relative overflow-hidden bg-[#24231f] px-5 py-20 text-[#e8e0d1] sm:px-8 sm:py-28 lg:px-12"><div className="absolute -right-16 -top-20 h-80 w-80 rounded-full border border-[#f04d23]/40" /><div className="relative mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24"><Reveal><div><div className="font-mono-custom text-[10px] tracking-[.18em] text-[#d9e66c]">06 / LE PREMIER PAS</div><h2 className="mt-6 max-w-[520px] font-display text-[clamp(4rem,8vw,7.7rem)] font-black uppercase leading-[.78] tracking-[-.04em]">À<br /><span className="text-[#f04d23]">vous.</span></h2><p className="mt-8 max-w-[370px] text-[15px] leading-7 text-[#bbb5ab]">Venez pendant sept jours. Repartez avec un plan que vous pourrez vraiment tenir.</p><div className="mt-9 flex items-center gap-3 font-mono-custom text-[10px] tracking-[.12em] text-[#d9e66c]"><Sparkles size={15} /> 7 JOURS OFFERTS + BILAN AVEC UN COACH</div></div></Reveal><Reveal className="delay-1">{submitted ? <div className="flex min-h-[390px] flex-col justify-center border border-[#5b5a52] bg-[#2d2c27] p-7 sm:p-10"><div className="flex h-12 w-12 items-center justify-center bg-[#d9e66c] text-[#24231f]"><Check size={24} /></div><h3 className="mt-7 font-display text-5xl font-bold uppercase leading-none">Vous êtes<br />sur la liste.</h3><p className="mt-5 max-w-[340px] text-[14px] leading-6 text-[#bbb5ab]">Merci d’avoir fait le premier pas. Un coach de Mercer Street vous contactera bientôt pour réserver votre première séance.</p><button onClick={() => setSubmitted(false)} className="mt-8 self-start font-mono-custom text-[10px] tracking-[.14em] text-[#d9e66c] underline underline-offset-4" data-testid="button-submit-another">ENVOYER UNE AUTRE DEMANDE</button></div> : <form onSubmit={submit} className="border border-[#5b5a52] bg-[#2d2c27] p-6 sm:p-9"><div className="mb-8 flex items-center justify-between border-b border-[#4c4b45] pb-5"><span className="font-display text-2xl font-bold">RÉSERVER VOTRE BILAN</span><span className="font-mono-custom text-[9px] tracking-[.14em] text-[#8f8c84]">01 — 04</span></div><div className="grid gap-6 sm:grid-cols-2"><label className="block sm:col-span-2"><span className="font-mono-custom text-[9px] tracking-[.16em] text-[#aaa69d]">VOTRE NOM</span><input required name="name" type="text" placeholder="Prénom et nom" className="mt-2 w-full border-0 border-b border-[#5a5952] bg-transparent px-0 py-3 text-[15px] text-[#e8e0d1] outline-none placeholder:text-[#77756d] focus:border-[#d9e66c]" data-testid="input-name" /></label><label className="block"><span className="font-mono-custom text-[9px] tracking-[.16em] text-[#aaa69d]">E-MAIL</span><input required name="email" type="email" placeholder="vous@exemple.fr" className="mt-2 w-full border-0 border-b border-[#5a5952] bg-transparent px-0 py-3 text-[15px] text-[#e8e0d1] outline-none placeholder:text-[#77756d] focus:border-[#d9e66c]" data-testid="input-email" /></label><label className="block"><span className="font-mono-custom text-[9px] tracking-[.16em] text-[#aaa69d]">TÉLÉPHONE</span><input required name="phone" type="tel" placeholder="Votre numéro" className="mt-2 w-full border-0 border-b border-[#5a5952] bg-transparent px-0 py-3 text-[15px] text-[#e8e0d1] outline-none placeholder:text-[#77756d] focus:border-[#d9e66c]" data-testid="input-phone" /></label><label className="block sm:col-span-2"><span className="font-mono-custom text-[9px] tracking-[.16em] text-[#aaa69d]">VOTRE OBJECTIF</span><select name="goal" defaultValue="" className="mt-2 w-full border-0 border-b border-[#5a5952] bg-[#2d2c27] px-0 py-3 text-[15px] text-[#e8e0d1] outline-none focus:border-[#d9e66c]" data-testid="select-goal"><option value="" disabled>Choisissez votre objectif principal</option><option>Devenir plus fort</option><option>Créer une routine durable</option><option>Améliorer mon endurance</option><option>Me sentir mieux dans mon corps</option></select></label></div><button disabled={busy} type="submit" className="group mt-9 flex w-full items-center justify-between bg-[#f04d23] px-5 py-4 font-mono-custom text-[11px] tracking-[.14em] text-[#e8e0d1] transition-colors hover:bg-[#ff6338] disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-lead">{busy ? 'ENVOI…' : 'RÉSERVER MES 7 JOURS'}<ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button><p className="mt-4 text-center text-[10px] text-[#77756d]">Aucune carte. Aucune pression. Juste un échange.</p></form>}</Reveal></div></section>;
}

function Footer() {
  return <footer className="bg-[#171816] px-5 pb-8 pt-12 text-[#e8e0d1] sm:px-8 lg:px-12"><div className="mx-auto max-w-[1280px]"><div className="grid gap-12 border-b border-[#3e3d38] pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><Logo light /><p className="mt-6 max-w-[235px] text-[12px] leading-5 text-[#89877f]">Force et conditionnement pour durer. 14 Mercer Street, votre nouveau rendez-vous.</p></div><div><div className="font-mono-custom text-[9px] tracking-[.16em] text-[#d9e66c]">NOUS TROUVER</div><p className="mt-4 text-[13px] leading-6 text-[#bbb5ab]">14 Mercer Street<br />Lun–Ven · 5 h 30—21 h<br />Sam · 8 h—14 h</p></div><div><div className="font-mono-custom text-[9px] tracking-[.16em] text-[#d9e66c]">NOUS CONTACTER</div><a href="mailto:hello@ironhall.training" className="mt-4 block text-[13px] text-[#bbb5ab] underline decoration-[#f04d23] underline-offset-4" data-testid="link-email">hello@ironhall.training</a><a href="tel:+441612220145" className="mt-2 block text-[13px] text-[#bbb5ab]" data-testid="link-phone">0161 222 0145</a></div><div><div className="font-mono-custom text-[9px] tracking-[.16em] text-[#d9e66c]">SUIVEZ LE MOUVEMENT</div><a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 text-[13px] text-[#bbb5ab]" data-testid="link-instagram"><Instagram size={16} /> @ironhall.training <MoveUpRight size={13} /></a></div></div><div className="flex flex-col justify-between gap-3 pt-7 font-mono-custom text-[9px] tracking-[.1em] text-[#65645e] sm:flex-row"><span>© 2024 IRONHALL TRAINING CO.</span><span>CONÇU POUR LE PROCHAIN MOUVEMENT.</span></div></div></footer>;
}

function Home() {
  const scrollToLead = () => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  return <main><Header onTrial={scrollToLead} /><Hero onTrial={scrollToLead} /><Ticker /><Method /><Classes /><Proof /><Story /><Visit /><FAQ /><LeadForm /><Footer /><button onClick={scrollToLead} className="fixed bottom-4 right-4 z-20 flex items-center gap-2 bg-[#f04d23] px-4 py-3 font-mono-custom text-[10px] tracking-[.11em] text-[#e8e0d1] shadow-xl transition-transform hover:-translate-y-1 sm:hidden" data-testid="button-floating-trial">COMMENCER <ArrowRight size={14} /></button></main>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Youtube,
  Music2,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  BookOpen,
  Clock,
  Users,

  GraduationCap,
  Sparkles,
} from "lucide-react";

/**
 * components/site-footer.tsx
 * Elegant, content‑rich footer matching the provided design.
 * Tailwind + shadcn/ui, SSR‑friendly.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/dugsiiyeblog", label: "Blog" },
    { href: "/mentor", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/testimonials", label: "Testimonials" },
  ];

  const popularCourses = [
    {
      title: "AI‑Powered SaaS with Next.js, Typescript, ...",
      hours: "12.8 hours",
      students: 0,
      href: "#",
    },
    {
      title: "Graphic Design Masterclass | Beginners...",
      hours: "2.9 hours",
      students: 0,
      href: "#",
    },
    {
      title: "Step By Step Data Visualization Using...",
      hours: "1.3 hours",
      students: 0,
      href: "#",
    },
    {
      title: "Advanced Portrait Retouching Course",
      hours: "4 hours",
      students: 0,
      href: "#",
    },
    {
      title: "React Master Class with Redux, Hooks, ...",
      hours: "28.3 hours",
      students: 0,
      href: "#",
    },
  ];

  const latestArticles = [
    { title: "Waa Maxay Reverse Engineering, Sideese Loo Adeegsadaa", date: "February 27, 2025", href: "#" },
    { title: "Waa Maxay MIT License, Maxaase Aan U Doortaa", date: "January 14, 2025", href: "#" },
    { title: "10‑ka Programming Languages Ugu Fiican 2025", date: "January 14, 2025", href: "#" },
    { title: "Sidee Loo Noqdaa Ethical Hacker", date: "January 14, 2025", href: "#" },
    { title: "Waa Maxay Computer Science", date: "January 14, 2025", href: "#" },
  ];

  return (
    <footer className="border-t bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + blurb + socials */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              {/* Replace with your logo if desired */}
              <div className="h-6 w-24 bg-[url('/logo.svg')] bg-contain bg-left bg-no-repeat dark:invert-[.02]" aria-label="Dugsiye" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Transforming tech education for Somali learners—Ku baro barnaamijyada Coding‑ka iyo IT‑ga (Af‑Soomaali).
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { Icon: Youtube, href: "https://youtube.com" },
                { Icon: Music2, href: "https://tiktok.com" },
                { Icon: MessageCircle, href: "https://wa.me/252614251112" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
              ].map(({ Icon, href }, i) => (
                <Button
                  key={i}
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                  <Link href={href} target="_blank" rel="noreferrer">
                    <Icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links + promo card */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Promo card */}
            <Card className="mt-5 rounded-2xl border-emerald-100/80 bg-emerald-50/60 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <CardContent className="p-4">
                <div className="mb-1 flex items-start gap-2">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Full‑Stack Software Engineer Mentorship (Af‑Soomaali)
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      Learn full‑stack development—from front‑end to AI—while receiving direct mentorship, Somali‑taught lessons, and real‑world projects.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mentorship"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  <Sparkles className="h-4 w-4" /> Learn More
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Popular Courses</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {popularCourses.map((c) => (
                <li key={c.title} className="truncate">
                  <Link href={c.href} className="text-slate-700 hover:underline dark:text-slate-300">
                    {c.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-4 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.hours}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.students}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="#" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
              <BookOpen className="h-4 w-4" /> View All Courses
            </Link>
          </div>

          {/* Latest Articles */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Latest Articles</h4>
            <ul className="mt-3 space-y-3 text-sm">
              {latestArticles.map((a) => (
                <li key={a.title}>
                  <Link href={a.href} className="line-clamp-1 text-slate-700 hover:underline dark:text-slate-300">
                    {a.title}
                  </Link>
                  <div className="text-xs text-slate-400">{a.date}</div>
                </li>
              ))}
            </ul>
            <Link href="#" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
              <Sparkles className="h-4 w-4" /> Read More Articles
            </Link>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p>© {year} Dugsiye. All rights reserved.</p>
            <p>
              Proudly Engineered with <span className="mx-1">⚛︎</span> in Somalia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

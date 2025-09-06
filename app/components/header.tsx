"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

/**
 * DugsiyeHeader — responsive top bar
 * - Mobile: brand + theme toggle + hamburger (sheet menu)
 * - Desktop: nav in the middle, actions on right
 */
export default function DugsiyeHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/dugsiiye"
          className="flex items-center"
          aria-label="Dugsiye Home"
        >
          <span className="relative block h-10 w-28 md:h-12 md:w-36">
            <Image
              src="/somtech.jpg"
              alt="Dugsiye Logo"
              fill
              priority
              sizes="(max-width: 768px) 112px, 144px"
              className="object-contain"
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <NavLink href="/dugsiiye">Home</NavLink>
          <NavLink href="/mentorship">Mentorship</NavLink>
          <NavLink href="/courses">Courses</NavLink>
          <NavLink href="/dugsiiyeblog">Blog</NavLink>
          <NavLink href="/somtechcommunity">Community</NavLink>
          <NavLink href="/dugsiiyeabout">About</NavLink>
          <NavLink href="/dugsiiyecontact">Contact</NavLink>
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          <Button
            variant="outline"
            className="h-9 rounded-full border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-900/60"
            asChild
          >
            <Link href="/sigin">Sign In</Link>
          </Button>
          <Button
            className="h-9 rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-600/90"
            asChild
          >
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900/60"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>

              <div className="mt-6 grid gap-2">
                <MobileNavLink href="/dugsiiye">Home</MobileNavLink>
                <MobileNavLink href="/mentorship">Mentorship</MobileNavLink>
                <MobileNavLink href="/courses">Courses</MobileNavLink>
                <MobileNavLink href="/dugsiiyeblog">Blog</MobileNavLink>
                <MobileNavLink href="/somtechcommunity">Community</MobileNavLink>
                <MobileNavLink href="/dugsiiyeabout">About</MobileNavLink>
                <MobileNavLink href="/dugsiiyecontact">Contact</MobileNavLink>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/sigin">Sign In</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/get-started">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded px-1.5 py-1 text-[15px] font-medium text-slate-700 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:text-slate-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-[15px] font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
    >
      {children}
    </Link>
  );
}

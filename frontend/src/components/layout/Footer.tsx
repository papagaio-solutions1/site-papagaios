import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      {/* Transição solar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-highlight to-primary" />

      <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo variant="dark" />
            <p className="mt-4 text-sm leading-6 text-white/60">
              {siteConfig.description}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
          © {year} {siteConfig.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

/** Lockup da marca fiel ao logo: símbolo + "Papagaios Solutions" + "IA & Automação". */
export function Logo({
  variant = "light",
  priority = false,
}: {
  variant?: "light" | "dark";
  priority?: boolean;
}) {
  const dark = variant === "dark";
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label={`${siteConfig.name} — IA & Automação`}
    >
      <Image
        src="/brand/symbol.png"
        alt=""
        width={128}
        height={128}
        quality={100}
        priority={priority}
        className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-black/10 sm:h-14 sm:w-14"
      />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight sm:text-2xl">
          <span className={dark ? "text-white" : "text-foreground"}>Papagaios</span>{" "}
          <span className="text-primary">Solutions</span>
        </span>
        <span className="mt-1 text-[0.66rem] font-semibold leading-none tracking-[0.18em] uppercase">
          <span className="text-primary">IA</span>
          <span className={dark ? "text-white/55" : "text-muted-foreground"}>
            {" "}
            &amp; Automação
          </span>
        </span>
      </span>
    </Link>
  );
}

import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Avatar do "Guto" — mascote papagaio dourado da Papagaios Solutions,
 * recortado em círculo a partir de `public/brand/guto.png`.
 * Para trocar a arte, substitua o arquivo.
 */
export function GutoAvatar({
  size = 48,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/guto.png"
      alt="Guto, assistente virtual da Papagaios Solutions"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 select-none rounded-full object-cover", className)}
    />
  );
}

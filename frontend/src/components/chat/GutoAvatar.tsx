import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Avatar do "Guto" — imagem real (metade humano / metade robô), recortada em
 * círculo a partir de `public/brand/guto.webp` (mesma arte do site de referência).
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
      src="/brand/guto.webp"
      alt="Guto, assistente virtual da Papagaios Solutions"
      width={size}
      height={size}
      quality={100}
      priority={priority}
      className={cn("shrink-0 select-none rounded-full object-cover", className)}
    />
  );
}

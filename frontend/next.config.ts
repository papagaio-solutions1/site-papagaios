import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera build self-contained em .next/standalone (deploy enxuto na VPS:
  // sobe o artefato + roda `node server.js`, sem npm install no servidor).
  output: "standalone",

  // Nitidez máxima: serve as imagens de marca/cases na resolução original, sem
  // recompressão do otimizador (que deixava logo e hero com aspecto "fosco").
  images: {
    unoptimized: true,
  },

  // Redirect 301 do slug antigo do case (renomeado de Zivvo Station -> Cooler Gym),
  // para não quebrar links já compartilhados de /cases/zivvo-station.
  async redirects() {
    return [
      {
        source: "/cases/zivvo-station",
        destination: "/cases/cooler-gym",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

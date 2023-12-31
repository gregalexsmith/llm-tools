import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LLM Tools",
    short_name: "LLM Tools",
    description: "LLM Tools",
    start_url: ".",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
      {
        src: "logo192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "logo512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    permissions: ["notifications"],
  };
}

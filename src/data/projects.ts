export type ProjectMeta = {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  repo?: string;
  live?: string;
  tech: string[];
};

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "placeholder-1",
    title: "Library of Knowledge",
    blurb: "Get smarter",
    image: "Library.jpg",
    tech: ["React", "TypeScript"],
  },
  {
    slug: "placeholder-2",
    title: "The Space Journey",
    blurb: "Journey throughout Space",
    image: "Space.jpg",
    tech: ["React", "Canvas"],
  },
  {
    slug: "placeholder-3",
    title: "What's for dinner",
    blurb: "Having trouble knowing what to cook?",
    image: "Food1.jpg",
    tech: ["Vite", "Tailwind"],
  },
];

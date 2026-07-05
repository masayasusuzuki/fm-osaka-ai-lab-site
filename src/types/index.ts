export type AccentColor = "pink" | "orange" | "blue" | "green";

export interface Episode {
  id: string;
  slug: string;
  episodeNumber: number;
  title: string;
  theme: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  publishedAt: string;
  accentColor: AccentColor;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  episodeSlug: string;
  excerpt: string;
  body: string;
  thumbnail: string;
  snsPosts: SnsPost[];
  publishedAt: string;
}

export interface SnsPost {
  platform: "X" | "Instagram" | "Facebook";
  text: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  image: string;
  snsLinks?: { type: string; url: string }[];
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  linkUrl: string;
  order: number;
}

export type BlogCategorySummary = {
  name: string;
  slug: string;
};

export type BlogTagSummary = {
  name: string;
  slug: string;
};

export type BlogPostCard = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string;
  category: BlogCategorySummary | null;
  tags: BlogTagSummary[];
};

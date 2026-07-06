export const LOCALE_STORAGE_KEY = "neonMoonLocale";

export type Locale = "en" | "zh";

export type LocalizedText = string | Record<Locale, string>;

type FeatureCardTranslation = {
  title: string;
  description: string;
};

type TranslationDictionary = {
  nav: {
    home: string;
    blog: string;
    posts: string;
    media: string;
    collection: string;
    photos: string;
    gallery: string;
    search: string;
    searchPlaceholder: string;
  };
  language: {
    label: string;
    english: string;
    chinese: string;
  };
  adminHeader: {
    adminArea: string;
    backToDashboard: string;
    logout: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    cards: {
      blog: FeatureCardTranslation;
      media: FeatureCardTranslation;
      photos: FeatureCardTranslation;
    };
  };
  adminDashboard: {
    eyebrow: string;
    title: string;
    description: string;
    cardKicker: string;
    directNoticePrefix: string;
    directNoticeSuffix: string;
    cards: {
      blog: FeatureCardTranslation & { label: string };
      media: FeatureCardTranslation & { label: string };
      photos: FeatureCardTranslation & { label: string };
    };
  };
};

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    nav: {
      home: "Home",
      blog: "Blog",
      posts: "Posts",
      media: "Media",
      collection: "Collection",
      photos: "Photos",
      gallery: "Gallery",
      search: "Search",
      searchPlaceholder: "Search...",
    },
    language: {
      label: "Language",
      english: "English",
      chinese: "中文",
    },
    adminHeader: {
      adminArea: "Admin Area",
      backToDashboard: "← Back to Admin Dashboard",
      logout: "Logout",
    },
    home: {
      eyebrow: "Personal Full-Stack Website",
      title: "Welcome to My Life Site - Neon Moon",
      description:
        "This website will become my personal digital space for blogs, media collections, photos, music, books, movies, anime, and games.",
      cards: {
        blog: {
          title: "Blog",
          description: "Technical notes and life reflections.",
        },
        media: {
          title: "Media Library",
          description: "Music, books, movies, anime, and games I like.",
        },
        photos: {
          title: "Photos",
          description: "Travel and daily-life photography.",
        },
      },
    },
    adminDashboard: {
      eyebrow: "Admin Dashboard",
      title: "Manage NEON MOON",
      description:
        "A private entry point for managing blog posts, media collections, and photography uploads.",
      cardKicker: "Admin",
      directNoticePrefix:
        "This page is intentionally not shown in the public navigation bar. Access it directly through ",
      directNoticeSuffix: ".",
      cards: {
        blog: {
          title: "Blog Admin",
          description:
            "Create, edit, publish, unpublish, and manage personal blog posts.",
          label: "Manage blog",
        },
        media: {
          title: "Media Admin",
          description:
            "Create, edit, delete, and manage movies, music, books, anime, and games.",
          label: "Manage media",
        },
        photos: {
          title: "Photos Admin",
          description:
            "Review photo records, upload new images, and manage gallery metadata.",
          label: "Manage photos",
        },
      },
    },
  },
  zh: {
    nav: {
      home: "首页",
      blog: "博客",
      posts: "博客文章",
      media: "媒体收藏",
      collection: "收藏列表",
      photos: "相册",
      gallery: "照片墙",
      search: "搜索",
      searchPlaceholder: "搜索...",
    },
    language: {
      label: "语言",
      english: "English",
      chinese: "中文",
    },
    adminHeader: {
      adminArea: "后台管理",
      backToDashboard: "← 返回后台首页",
      logout: "退出登录",
    },
    home: {
      eyebrow: "个人全栈网站",
      title: "欢迎来到我的生活网站 - Neon Moon",
      description:
        "这里会成为我的个人数字空间，用来记录博客、媒体收藏、照片、音乐、书籍、电影、动画和游戏。",
      cards: {
        blog: {
          title: "博客",
          description: "技术笔记和生活随想。",
        },
        media: {
          title: "媒体收藏",
          description: "我喜欢的音乐、书籍、电影、动画和游戏。",
        },
        photos: {
          title: "相册",
          description: "旅行和日常生活摄影。",
        },
      },
    },
    adminDashboard: {
      eyebrow: "后台首页",
      title: "管理 NEON MOON",
      description: "用于管理博客文章、媒体收藏和照片上传的私密入口。",
      cardKicker: "后台",
      directNoticePrefix: "此页面不会显示在公开导航栏中，请直接通过 ",
      directNoticeSuffix: " 访问。",
      cards: {
        blog: {
          title: "博客管理",
          description: "创建、编辑、发布、取消发布和管理个人博客文章。",
          label: "管理博客",
        },
        media: {
          title: "媒体管理",
          description: "创建、编辑、删除和管理电影、音乐、书籍、动画与游戏。",
          label: "管理媒体",
        },
        photos: {
          title: "照片管理",
          description: "查看照片记录、上传新图片并管理图库元数据。",
          label: "管理照片",
        },
      },
    },
  },
};

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "zh";
}

export function getTranslation(locale: Locale) {
  return translations[locale];
}

export function resolveLocalizedText(text: LocalizedText, locale: Locale) {
  return typeof text === "string" ? text : text[locale];
}

export const LOCALE_STORAGE_KEY = "neonMoonLocale";

export type Locale = "en" | "zh";

export type LocalizedText = string | Record<Locale, string>;

type FeatureCardTranslation = {
  title: string;
  description: string;
};

type MediaCategoryTranslations = {
  all: string;
  music: string;
  book: string;
  movie: string;
  anime: string;
  game: string;
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
  blog: {
    eyebrow: string;
    title: string;
    description: string;
    posts: string;
    latestPosts: string;
    publishedPosts: string;
    published: string;
    readMore: string;
    backToBlog: string;
    noPostsYet: string;
    noPostsDescription: string;
    blogPost: string;
    postedOn: string;
    updatedOn: string;
  };
  media: {
    eyebrow: string;
    collection: string;
    mediaCollection: string;
    title: string;
    description: string;
    categories: MediaCategoryTranslations;
    creator: string;
    releaseYear: string;
    rating: string;
    notes: string;
    created: string;
    updated: string;
    unknown: string;
    unknownCreator: string;
    releasedIn: string;
    noCover: string;
    mediaDetail: string;
    personalNote: string;
    noNote: string;
    viewDetails: string;
    viewAllMedia: string;
    backToMedia: string;
    noMediaItemsYet: string;
    noMediaDescription: string;
  };
  photos: {
    eyebrow: string;
    gallery: string;
    photoGallery: string;
    title: string;
    description: string;
    photoDetail: string;
    location: string;
    takenAt: string;
    descriptionLabel: string;
    viewPhoto: string;
    viewDetails: string;
    backToPhotos: string;
    backToGallery: string;
    noPhotosYet: string;
    noPhotosDescription: string;
  };
  search: {
    eyebrow: string;
    title: string;
    description: string;
    queryLabel: string;
    placeholder: string;
    button: string;
    noQueryTitle: string;
    noQueryDescription: string;
    noResultsFound: string;
    tryAnotherKeyword: string;
    results: string;
    result: string;
    resultsForPrefix: string;
    resultsForSuffix: string;
    blogPosts: string;
    blogPost: string;
    mediaItems: string;
    mediaItem: string;
    photos: string;
    photo: string;
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
    blog: {
      eyebrow: "Blog",
      title: "Notes, essays, and development logs",
      description:
        "A personal writing space for technical notes, reflections, music thoughts, and project updates.",
      posts: "Posts",
      latestPosts: "Latest posts",
      publishedPosts: "Published posts",
      published: "Published",
      readMore: "Read more",
      backToBlog: "← Back to Blog",
      noPostsYet: "No posts yet.",
      noPostsDescription:
        "Add posts to the database and they will appear here.",
      blogPost: "Blog Post",
      postedOn: "Posted on",
      updatedOn: "Updated on",
    },
    media: {
      eyebrow: "Media",
      collection: "Collection",
      mediaCollection: "Media Collection",
      title: "Movies, music, books, anime, and games",
      description:
        "A personal archive of media that shaped my taste, memory, and creative references.",
      categories: {
        all: "All",
        music: "Music",
        book: "Book",
        movie: "Movie",
        anime: "Anime",
        game: "Game",
      },
      creator: "Creator",
      releaseYear: "Release Year",
      rating: "Rating",
      notes: "Notes",
      created: "Created",
      updated: "Updated",
      unknown: "Unknown",
      unknownCreator: "Unknown creator",
      releasedIn: "Released in",
      noCover: "No Cover",
      mediaDetail: "Media Detail",
      personalNote: "Personal note",
      noNote: "No note has been added for this media item yet.",
      viewDetails: "View details",
      viewAllMedia: "View all media",
      backToMedia: "← Back to Media",
      noMediaItemsYet: "No media items yet.",
      noMediaDescription:
        "New media notes will appear here once they are added to the collection.",
    },
    photos: {
      eyebrow: "Photos",
      gallery: "Gallery",
      photoGallery: "Photo Gallery",
      title: "Visual notes from places, days, and small moments",
      description:
        "A personal photo archive loaded from the MySQL database through Prisma.",
      photoDetail: "Photo Detail",
      location: "Location",
      takenAt: "Taken at",
      descriptionLabel: "Description",
      viewPhoto: "View photo",
      viewDetails: "View details",
      backToPhotos: "← Back to Photos",
      backToGallery: "← Back to Gallery",
      noPhotosYet: "No photos yet.",
      noPhotosDescription:
        "Add photo records to the database and they will appear here.",
    },
    search: {
      eyebrow: "Search",
      title: "Search NEON MOON",
      description: "Search posts, media, and photos.",
      queryLabel: "Search query",
      placeholder: "Enter keywords",
      button: "Search",
      noQueryTitle: "Enter keywords to search.",
      noQueryDescription:
        "Try words like moon, Tokyo, music, website, or Interstellar.",
      noResultsFound: "No results found",
      tryAnotherKeyword: "Try another keyword.",
      results: "Results",
      result: "result",
      resultsForPrefix: "Found",
      resultsForSuffix: "for",
      blogPosts: "Blog posts",
      blogPost: "Blog post",
      mediaItems: "Media items",
      mediaItem: "Media item",
      photos: "Photos",
      photo: "Photo",
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
    blog: {
      eyebrow: "博客",
      title: "笔记、随笔和开发日志",
      description: "记录技术笔记、生活思考、音乐想法和项目更新的个人写作空间。",
      posts: "文章",
      latestPosts: "最新文章",
      publishedPosts: "已发布文章",
      published: "已发布",
      readMore: "阅读更多",
      backToBlog: "← 返回博客",
      noPostsYet: "暂无文章。",
      noPostsDescription: "添加文章到数据库后，它们会显示在这里。",
      blogPost: "博客文章",
      postedOn: "发布于",
      updatedOn: "更新于",
    },
    media: {
      eyebrow: "媒体收藏",
      collection: "收藏",
      mediaCollection: "媒体收藏",
      title: "电影、音乐、书籍、动画和游戏",
      description: "一个记录审美、记忆和创作参考的个人媒体档案。",
      categories: {
        all: "全部",
        music: "音乐",
        book: "书籍",
        movie: "电影",
        anime: "动画",
        game: "游戏",
      },
      creator: "创作者",
      releaseYear: "发行年份",
      rating: "评分",
      notes: "备注",
      created: "创建于",
      updated: "更新于",
      unknown: "未知",
      unknownCreator: "未知创作者",
      releasedIn: "发行于",
      noCover: "无封面",
      mediaDetail: "媒体详情",
      personalNote: "个人备注",
      noNote: "这条媒体收藏还没有添加备注。",
      viewDetails: "查看详情",
      viewAllMedia: "查看全部媒体",
      backToMedia: "← 返回媒体收藏",
      noMediaItemsYet: "暂无媒体收藏。",
      noMediaDescription: "添加新的媒体记录后，它们会显示在这里。",
    },
    photos: {
      eyebrow: "相册",
      gallery: "图库",
      photoGallery: "照片图库",
      title: "来自地点、日子和小瞬间的视觉记录",
      description: "通过 Prisma 从 MySQL 数据库读取的个人照片档案。",
      photoDetail: "照片详情",
      location: "地点",
      takenAt: "拍摄时间",
      descriptionLabel: "描述",
      viewPhoto: "查看照片",
      viewDetails: "查看详情",
      backToPhotos: "← 返回相册",
      backToGallery: "← 返回图库",
      noPhotosYet: "暂无照片。",
      noPhotosDescription: "添加照片记录到数据库后，它们会显示在这里。",
    },
    search: {
      eyebrow: "搜索",
      title: "搜索 NEON MOON",
      description: "搜索文章、媒体收藏和照片。",
      queryLabel: "搜索关键词",
      placeholder: "输入关键词",
      button: "搜索",
      noQueryTitle: "输入关键词开始搜索。",
      noQueryDescription: "可以尝试 moon、Tokyo、music、website 或 Interstellar。",
      noResultsFound: "没有找到结果",
      tryAnotherKeyword: "请尝试其他关键词。",
      results: "搜索结果",
      result: "条结果",
      resultsForPrefix: "找到",
      resultsForSuffix: "关于",
      blogPosts: "博客文章",
      blogPost: "博客文章",
      mediaItems: "媒体收藏",
      mediaItem: "媒体收藏",
      photos: "照片",
      photo: "照片",
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

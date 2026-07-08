export const LOCALE_STORAGE_KEY = "neonMoonLocale";

export type Locale = "en" | "zh";

export type LocalizedText = string | Record<Locale, string>;

type FeatureCardTranslation = {
  title: string;
  description: string;
};

type AboutMetricTranslation = {
  label: string;
  value: string;
};

type AboutEducationTranslation = {
  school: string;
  program: string;
  years: string;
  note: string;
};

type AboutSkillTranslation = {
  name: string;
  level: number;
  note: string;
};

type AboutSkillGroupTranslation = {
  title: string;
  items: AboutSkillTranslation[];
};

type AboutLanguageTranslation = {
  name: string;
  level: string;
  note: string;
  value: number;
};

type AboutTranslations = {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  avatarLabel: string;
  profileName: string;
  profileLine: string;
  identity: AboutMetricTranslation[];
  introEyebrow: string;
  introTitle: string;
  introParagraphs: string[];
  educationTitle: string;
  educationIntro: string;
  education: AboutEducationTranslation[];
  skillsTitle: string;
  skillsIntro: string;
  skillGroups: AboutSkillGroupTranslation[];
  languagesTitle: string;
  languagesIntro: string;
  languages: AboutLanguageTranslation[];
  interestsTitle: string;
  interestsIntro: string;
  interests: string[];
  quoteTitle: string;
  quote: string;
  quoteAuthor: string;
};

type MediaCategoryTranslations = {
  all: string;
  music: string;
  book: string;
  movie: string;
  anime: string;
  game: string;
};

type BlogAdminTranslations = {
  adminName: string;
  viewPublicBlog: string;
  backToBlogAdmin: string;
  manageTitle: string;
  manageDescription: string;
  createTitle: string;
  createDescription: string;
  editTitle: string;
  editDescription: string;
  newPost: string;
  loadingPosts: string;
  postSingular: string;
  postPlural: string;
  foundSuffix: string;
  all: string;
  published: string;
  draft: string;
  noPostsInView: string;
  noPostsHint: string;
  title: string;
  slug: string;
  status: string;
  updated: string;
  createdOn: string;
  edit: string;
  view: string;
  updating: string;
  unpublish: string;
  publish: string;
  invalidPostId: string;
  loadingPost: string;
  postCouldNotLoad: string;
  editingPostPrefix: string;
  lastUpdatedOn: string;
  titlePlaceholder: string;
  slugPlaceholder: string;
  excerpt: string;
  excerptPlaceholder: string;
  category: string;
  categoryPlaceholder: string;
  tags: string;
  tagsPlaceholder: string;
  tagsHelp: string;
  coverImageUrl: string;
  coverImageUrlPlaceholder: string;
  content: string;
  contentPlaceholder: string;
  slugCreateHelp: string;
  slugEditHelp: string;
  publishImmediately: string;
  publishThisPost: string;
  creating: string;
  createPost: string;
  saving: string;
  saveChanges: string;
  failedToLoadPosts: string;
  failedToLoadPostsUnexpected: string;
  failedToUpdatePublishStatus: string;
  publishStatusMissing: string;
  failedToUpdatePublishStatusUnexpected: string;
  failedToCreatePost: string;
  failedToCreatePostUnexpected: string;
  failedToLoadPost: string;
  failedToLoadPostUnexpected: string;
  failedToUpdatePost: string;
  failedToUpdatePostUnexpected: string;
};

type MediaAdminTranslations = {
  adminName: string;
  viewPublicMedia: string;
  backToMediaAdmin: string;
  manageTitle: string;
  manageDescription: string;
  createTitle: string;
  createDescription: string;
  editTitle: string;
  editDescription: string;
  newMediaItem: string;
  loadingMediaItems: string;
  itemSingular: string;
  itemPlural: string;
  foundSuffix: string;
  noMediaItemsInView: string;
  noMediaItemsHint: string;
  title: string;
  category: string;
  creator: string;
  rating: string;
  actions: string;
  releasedIn: string;
  updatedOn: string;
  createdOn: string;
  unknown: string;
  notRated: string;
  edit: string;
  deleting: string;
  delete: string;
  deleteConfirmPrefix: string;
  deleteConfirmSuffix: string;
  releaseYear: string;
  coverUrl: string;
  note: string;
  titlePlaceholder: string;
  creatorPlaceholder: string;
  releaseYearPlaceholder: string;
  ratingPlaceholder: string;
  coverUrlPlaceholder: string;
  notePlaceholder: string;
  editingItemPrefix: string;
  loadingMediaItem: string;
  creating: string;
  createMediaItem: string;
  saving: string;
  saveChanges: string;
  categories: MediaCategoryTranslations;
  failedToLoadMediaItems: string;
  failedToLoadMediaItemsUnexpected: string;
  failedToDeleteMediaItem: string;
  failedToDeleteMediaItemUnexpected: string;
  failedToCreateMediaItem: string;
  failedToCreateMediaItemUnexpected: string;
  failedToLoadMediaItem: string;
  mediaItemMissing: string;
  failedToLoadMediaItemUnexpected: string;
  failedToUpdateMediaItem: string;
  failedToUpdateMediaItemUnexpected: string;
};

type PhotosAdminTranslations = {
  adminName: string;
  viewPublicGallery: string;
  backToPhotosAdmin: string;
  viewPublicPhoto: string;
  manageTitle: string;
  manageDescription: string;
  uploadEyebrow: string;
  uploadTitle: string;
  uploadDescription: string;
  editEyebrow: string;
  editTitle: string;
  editDescription: string;
  uploadPhoto: string;
  loadingPhotos: string;
  photoSingular: string;
  photoPlural: string;
  foundSuffix: string;
  noPhotosFound: string;
  noPhotosHint: string;
  photoNumberPrefix: string;
  imagePreviewSuffix: string;
  location: string;
  taken: string;
  updated: string;
  unknown: string;
  view: string;
  edit: string;
  deleting: string;
  delete: string;
  deleteConfirmPrefix: string;
  deleteConfirmSuffix: string;
  deletedSuccessfully: string;
  imageFile: string;
  chooseFile: string;
  noFileSelected: string;
  supportedFormats: string;
  title: string;
  titlePlaceholder: string;
  imageUrl: string;
  locationPlaceholder: string;
  takenDate: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  uploading: string;
  loadingPhotoDetails: string;
  returnToPhotosAdmin: string;
  editingPhotoPrefix: string;
  saving: string;
  saveChanges: string;
  validPhotoIdRequired: string;
  failedToLoadPhotos: string;
  failedToLoadPhotosUnexpected: string;
  failedToDeletePhoto: string;
  failedToDeletePhotoUnexpected: string;
  failedToUploadPhoto: string;
  failedToUploadPhotoUnexpected: string;
  failedToLoadPhotoDetails: string;
  photoDetailsMissing: string;
  failedToLoadPhotoUnexpected: string;
  failedToUpdatePhoto: string;
  failedToSavePhotoUnexpected: string;
};

type AdminLoginTranslations = {
  backToHome: string;
  eyebrow: string;
  title: string;
  description: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submit: string;
  errors: {
    invalid: string;
    missingSecret: string;
    missingPassword: string;
    invalidRequest: string;
  };
};

type TranslationDictionary = {
  nav: {
    home: string;
    about: string;
    blog: string;
    posts: string;
    archives: string;
    categories: string;
    tags: string;
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
  adminLogin: AdminLoginTranslations;
  home: {
    eyebrow: string;
    poemLine: string;
    poemSource: string;
    poemTranslation: string;
    title: string;
    description: string;
    scrollLabel: string;
  };
  about: AboutTranslations;
  adminDashboard: {
    eyebrow: string;
    title: string;
    description: string;
    backToHome: string;
    cardKicker: string;
    directNoticePrefix: string;
    directNoticeSuffix: string;
    cards: {
      blog: FeatureCardTranslation & { label: string; quickLabel: string };
      media: FeatureCardTranslation & { label: string; quickLabel: string };
      photos: FeatureCardTranslation & { label: string; quickLabel: string };
    };
  };
  blogAdmin: BlogAdminTranslations;
  mediaAdmin: MediaAdminTranslations;
  photosAdmin: PhotosAdminTranslations;
  blog: {
    eyebrow: string;
    title: string;
    description: string;
    post: string;
    posts: string;
    archives: string;
    archiveDescription: string;
    categories: string;
    categoriesDescription: string;
    tags: string;
    tagsDescription: string;
    category: string;
    categoryDetailDescription: string;
    tagDetailDescription: string;
    noPostsInCategory: string;
    noPostsWithTag: string;
    backToCategories: string;
    backToTags: string;
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
    addedToCollection: string;
    unknown: string;
    unknownCreator: string;
    releasedIn: string;
    noCover: string;
    coverImageLabelSuffix: string;
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
      about: "About",
      blog: "Blog",
      posts: "All Posts",
      archives: "Archives",
      categories: "Categories",
      tags: "Tags",
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
    adminLogin: {
      backToHome: "← Back to Home",
      eyebrow: "Admin Login",
      title: "Sign in to NEON MOON",
      description: "Use the private admin password to open the dashboard.",
      passwordLabel: "Admin password",
      passwordPlaceholder: "Enter password",
      submit: "Sign in",
      errors: {
        invalid: "Invalid admin password.",
        missingSecret: "Admin session secret is not configured.",
        missingPassword: "Admin password is not configured.",
        invalidRequest: "Unable to read the login request. Please try again.",
      },
    },
    home: {
      eyebrow: "NEON MOON",
      poemLine: "春江潮水连海平，海上明月共潮生。",
      poemSource: "— Zhang Ruoxu, A Moonlit Night on the Spring River",
      poemTranslation:
        "The spring tide meets the sea; above the sea, the bright moon rises with the tide.",
      title: "Welcome to Neon Moon",
      description:
        "A quiet island in the online ocean, where I keep writing, photos, media notes, and small thoughts that grow slowly over time.",
      scrollLabel: "Scroll down",
    },
    about: {
      eyebrow: "About NEON MOON",
      heroTitle: "NEON MOON",
      heroSubtitle:
        "A personal archive for writing, photos, media notes, and quiet things I want to keep.",
      avatarLabel: "Avatar image for Louis",
      profileName: "Louis",
      profileLine:
        "Building a small personal site slowly, honestly, and for the long run.",
      identity: [
        {
          label: "Name",
          value: "Louis",
        },
        {
          label: "Role",
          value: "IT student and personal site builder",
        },
      ],
      introEyebrow: "Personal space",
      introTitle: "A quiet page for a site that is still growing.",
      introParagraphs: [
        "I am building this site as a long-term personal space for writing, media notes, travel photos, and small thoughts that are easier to keep when they have a home.",
        "NEON MOON does not need to be loud. I want it to be useful, personal, and easy to keep improving over time.",
      ],
      educationTitle: "Education",
      educationIntro:
        "A compact academic timeline, kept here as part of the larger personal archive.",
      education: [
        {
          school: "University of Queensland",
          program: "Master of Information Technology",
          years: "2026 -",
          note: "Current graduate study in information technology, with attention to how useful web tools are planned, built, and maintained.",
        },
        {
          school: "McMaster University",
          program: "Finance-focused commerce background, Minor in Mathematics",
          years: "Completed",
          note: "A finance-focused commerce background with a mathematics minor, which shaped how I think about data, products, and research questions.",
        },
      ],
      skillsTitle: "Skills",
      skillsIntro:
        "A practical toolkit I use while building and maintaining this site. These are notes, not scores.",
      skillGroups: [
        {
          title: "Frontend",
          items: [
            {
              name: "HTML",
              level: 70,
              note: "Page structure",
            },
            {
              name: "React",
              level: 76,
              note: "Product UI",
            },
            {
              name: "Next.js App Router",
              level: 74,
              note: "Site structure",
            },
            {
              name: "TypeScript",
              level: 72,
              note: "Safer code",
            },
            {
              name: "Tailwind CSS",
              level: 70,
              note: "Site styling",
            },
          ],
        },
        {
          title: "Site practice",
          items: [
            {
              name: "Writing pages",
              level: 68,
              note: "Organizing posts",
            },
            {
              name: "Private editing",
              level: 66,
              note: "Keeping updates tidy",
            },
            {
              name: "Privacy basics",
              level: 62,
              note: "Careful access",
            },
            {
              name: "Responsive pages",
              level: 65,
              note: "Desktop and mobile",
            },
          ],
        },
        {
          title: "Programming",
          items: [
            {
              name: "Java",
              level: 62,
              note: "Learning",
            },
            {
              name: "Python",
              level: 64,
              note: "Scripts",
            },
            {
              name: "JavaScript",
              level: 68,
              note: "Browser logic",
            },
            {
              name: "TypeScript",
              level: 72,
              note: "Typed apps",
            },
          ],
        },
        {
          title: "Tools",
          items: [
            {
              name: "Git",
              level: 70,
              note: "Version control",
            },
            {
              name: "GitHub",
              level: 68,
              note: "Repo workflow",
            },
            {
              name: "Docker",
              level: 60,
              note: "Deployment learning",
            },
            {
              name: "Oracle Cloud",
              level: 52,
              note: "VPS learning",
            },
          ],
        },
      ],
      languagesTitle: "Languages",
      languagesIntro:
        "Language ability as actually used: study, reading, writing, and daily communication.",
      languages: [
        {
          name: "Simplified Chinese",
          level: "Native",
          note: "Daily thinking and writing",
          value: 96,
        },
        {
          name: "Traditional Chinese",
          level: "Reading",
          note: "Comfortable reading",
          value: 78,
        },
        {
          name: "English",
          level: "Study and academic use",
          note: "Study, research, and projects",
          value: 86,
        },
        {
          name: "Japanese",
          level: "Beginner, currently learning",
          note: "Early-stage study",
          value: 28,
        },
        {
          name: "French",
          level: "Beginner, currently learning",
          note: "Early-stage study",
          value: 20,
        },
      ],
      interestsTitle: "Interests",
      interestsIntro:
        "A smaller list of things I keep coming back to.",
      interests: [
        "Photography",
        "Movies",
        "Anime",
        "Games",
        "History",
        "Literature / novels",
      ],
      quoteTitle: "Motto",
      quote:
        "Where my will leads, I move forward — stronger after every setback.",
      quoteAuthor: "Sun Yat-sen",
    },
    adminDashboard: {
      eyebrow: "Admin Dashboard",
      title: "Control your NEON MOON content",
      description:
        "A private entry point for managing blog posts, media collections, and photography uploads.",
      backToHome: "← Back to Home",
      cardKicker: "Admin",
      directNoticePrefix:
        "This page is intentionally not shown in the public navigation bar. Access it directly through ",
      directNoticeSuffix: ".",
      cards: {
        blog: {
          title: "Blog Posts",
          description:
            "Create, edit, publish, unpublish, and manage personal blog posts.",
          label: "Open Blog Admin",
          quickLabel: "Create new post",
        },
        media: {
          title: "Media Collection",
          description:
            "Create, edit, delete, and manage movies, music, books, anime, and games.",
          label: "Open Media Admin",
          quickLabel: "Add media item",
        },
        photos: {
          title: "Photos",
          description:
            "Review photo records, upload new images, and manage gallery metadata.",
          label: "Open Photos Admin",
          quickLabel: "Upload photo",
        },
      },
    },
    blogAdmin: {
      adminName: "Blog Admin",
      viewPublicBlog: "View public blog",
      backToBlogAdmin: "Back to Blog Admin",
      manageTitle: "Manage blog posts",
      manageDescription:
        "View published posts and drafts stored in the database.",
      createTitle: "Create a new post",
      createDescription:
        "Create a new blog post from the admin area and save it into the database.",
      editTitle: "Edit blog post",
      editDescription:
        "Update an existing blog post, change its publication status, and save the changes back to the database.",
      newPost: "New post",
      loadingPosts: "Loading blog posts...",
      postSingular: "post",
      postPlural: "posts",
      foundSuffix: "found.",
      all: "All",
      published: "Published",
      draft: "Draft",
      noPostsInView: "No posts in this view.",
      noPostsHint: "Switch filters or create a new blog post.",
      title: "Title",
      slug: "Slug",
      status: "Status",
      updated: "Updated",
      createdOn: "Created on",
      edit: "Edit",
      view: "View",
      updating: "Updating...",
      unpublish: "Unpublish",
      publish: "Publish",
      invalidPostId: "Invalid blog post id.",
      loadingPost: "Loading blog post...",
      postCouldNotLoad: "Blog post could not be loaded.",
      editingPostPrefix: "Editing post",
      lastUpdatedOn: "Last updated on",
      titlePlaceholder: "Enter a blog title",
      slugPlaceholder: "Enter a URL slug",
      excerpt: "Excerpt",
      excerptPlaceholder: "Write a short summary...",
      category: "Category",
      categoryPlaceholder: "Optional category, for example Travel",
      tags: "Tags",
      tagsPlaceholder: "travel, japan, thoughts",
      tagsHelp: "Separate tags with commas.",
      coverImageUrl: "Cover image URL",
      coverImageUrlPlaceholder: "Optional cover image path",
      content: "Content",
      contentPlaceholder: "Write the full blog content here...",
      slugCreateHelp:
        "Used in the URL. Use letters, numbers, and hyphens only.",
      slugEditHelp:
        "Used in the URL. Changing it will also change the public blog post URL.",
      publishImmediately: "Publish this post immediately",
      publishThisPost: "Publish this post",
      creating: "Creating...",
      createPost: "Create blog post",
      saving: "Saving...",
      saveChanges: "Update post",
      failedToLoadPosts: "Failed to load blog posts.",
      failedToLoadPostsUnexpected:
        "Something went wrong while loading blog posts.",
      failedToUpdatePublishStatus: "Failed to update publish status.",
      publishStatusMissing: "Publish status response is missing.",
      failedToUpdatePublishStatusUnexpected:
        "Something went wrong while updating publish status.",
      failedToCreatePost: "Failed to create blog post.",
      failedToCreatePostUnexpected:
        "Something went wrong while creating the blog post.",
      failedToLoadPost: "Failed to load blog post.",
      failedToLoadPostUnexpected:
        "Something went wrong while loading the blog post.",
      failedToUpdatePost: "Failed to update blog post.",
      failedToUpdatePostUnexpected:
        "Something went wrong while updating the blog post.",
    },
    mediaAdmin: {
      adminName: "Media Admin",
      viewPublicMedia: "View public media",
      backToMediaAdmin: "Back to Media Admin",
      manageTitle: "Manage media collection",
      manageDescription:
        "View, edit, create, and delete media items stored in the database.",
      createTitle: "Add a new media item",
      createDescription:
        "Add a movie, music record, book, anime, or game to your personal media collection.",
      editTitle: "Edit media item",
      editDescription:
        "Update the title, category, creator, release year, rating, cover URL, and personal note for this media item.",
      newMediaItem: "New media item",
      loadingMediaItems: "Loading media items...",
      itemSingular: "item",
      itemPlural: "items",
      foundSuffix: "found.",
      noMediaItemsInView: "No media items in this view.",
      noMediaItemsHint: "Switch filters or add new media items.",
      title: "Title",
      category: "Category",
      creator: "Creator",
      rating: "Rating",
      actions: "Actions",
      releasedIn: "Released in",
      updatedOn: "Updated on",
      createdOn: "Created on",
      unknown: "Unknown",
      notRated: "Not rated",
      edit: "Edit",
      deleting: "Deleting...",
      delete: "Delete",
      deleteConfirmPrefix: "Delete \"",
      deleteConfirmSuffix: "\"? This action cannot be undone.",
      releaseYear: "Release year",
      coverUrl: "Cover URL",
      note: "Note",
      titlePlaceholder: "Enter a title",
      creatorPlaceholder: "Director, artist, author, studio...",
      releaseYearPlaceholder: "Optional release year",
      ratingPlaceholder: "Optional rating from 0 to 10",
      coverUrlPlaceholder: "Optional cover image path or URL",
      notePlaceholder: "Write a short note about this media item...",
      editingItemPrefix: "Editing media item",
      loadingMediaItem: "Loading media item...",
      creating: "Creating...",
      createMediaItem: "Create media item",
      saving: "Saving...",
      saveChanges: "Update media item",
      categories: {
        all: "All",
        music: "Music",
        book: "Book",
        movie: "Movie",
        anime: "Anime",
        game: "Game",
      },
      failedToLoadMediaItems: "Failed to load media items.",
      failedToLoadMediaItemsUnexpected:
        "Something went wrong while loading media items.",
      failedToDeleteMediaItem: "Failed to delete media item.",
      failedToDeleteMediaItemUnexpected:
        "Something went wrong while deleting the media item.",
      failedToCreateMediaItem: "Failed to create media item.",
      failedToCreateMediaItemUnexpected:
        "Something went wrong while creating the media item.",
      failedToLoadMediaItem: "Failed to load media item.",
      mediaItemMissing: "Media item response is missing.",
      failedToLoadMediaItemUnexpected:
        "Something went wrong while loading the media item.",
      failedToUpdateMediaItem: "Failed to update media item.",
      failedToUpdateMediaItemUnexpected:
        "Something went wrong while updating the media item.",
    },
    photosAdmin: {
      adminName: "Photos Admin",
      viewPublicGallery: "View public gallery",
      backToPhotosAdmin: "Back to Photos Admin",
      viewPublicPhoto: "View public photo",
      manageTitle: "Manage photos",
      manageDescription:
        "View and manage photo records stored in the database.",
      uploadEyebrow: "Upload Photo",
      uploadTitle: "Add a new photo",
      uploadDescription:
        "Upload a local image file and save its details into the database.",
      editEyebrow: "Edit Photo",
      editTitle: "Update photo details",
      editDescription:
        "Edit the database record for this photo without changing the public gallery navigation.",
      uploadPhoto: "Upload photo",
      loadingPhotos: "Loading photos...",
      photoSingular: "photo",
      photoPlural: "photos",
      foundSuffix: "found.",
      noPhotosFound: "No photos found.",
      noPhotosHint: "Upload a photo to start building the gallery.",
      photoNumberPrefix: "Photo #",
      imagePreviewSuffix: " image preview",
      location: "Location",
      taken: "Taken",
      updated: "Updated",
      unknown: "Unknown",
      view: "View",
      edit: "Edit",
      deleting: "Deleting...",
      delete: "Delete",
      deleteConfirmPrefix: "Delete \"",
      deleteConfirmSuffix: "\"? This cannot be undone.",
      deletedSuccessfully: "Photo deleted successfully.",
      imageFile: "Image file",
      chooseFile: "Choose file",
      noFileSelected: "No file selected",
      supportedFormats:
        "Supported formats: JPG, PNG, WEBP. Maximum size: 8MB.",
      title: "Title",
      titlePlaceholder: "Enter a photo title",
      imageUrl: "Image URL",
      locationPlaceholder: "Enter a location",
      takenDate: "Taken date",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Write a short note about this photo...",
      uploading: "Uploading...",
      loadingPhotoDetails: "Loading photo details...",
      returnToPhotosAdmin: "Return to Photos Admin",
      editingPhotoPrefix: "Editing photo",
      saving: "Saving...",
      saveChanges: "Update photo",
      validPhotoIdRequired: "A valid photo id is required.",
      failedToLoadPhotos: "Failed to load photos.",
      failedToLoadPhotosUnexpected:
        "Something went wrong while loading photos.",
      failedToDeletePhoto: "Failed to delete photo.",
      failedToDeletePhotoUnexpected:
        "Something went wrong while deleting the photo.",
      failedToUploadPhoto: "Failed to upload photo.",
      failedToUploadPhotoUnexpected:
        "Something went wrong while uploading the photo.",
      failedToLoadPhotoDetails: "Failed to load photo details.",
      photoDetailsMissing: "Photo details were not returned.",
      failedToLoadPhotoUnexpected:
        "Something went wrong while loading the photo.",
      failedToUpdatePhoto: "Failed to update photo.",
      failedToSavePhotoUnexpected:
        "Something went wrong while saving the photo.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Life notes, essays, and project updates",
      description:
        "A personal writing space for life reflections, travel notes, and project updates.",
      post: "post",
      posts: "Posts",
      archives: "Archives",
      archiveDescription:
        "Older writing gathered by month, like a quiet shelf for the site.",
      categories: "Categories",
      categoriesDescription: "A few broad themes for finding related posts.",
      tags: "Tags",
      tagsDescription: "Smaller threads that connect notes across time.",
      category: "Category",
      categoryDetailDescription: "Writing collected under this theme.",
      tagDetailDescription: "Notes connected by this tag.",
      noPostsInCategory: "No posts in this category yet.",
      noPostsWithTag: "No posts with this tag yet.",
      backToCategories: "← Back to Categories",
      backToTags: "← Back to Tags",
      latestPosts: "Latest posts",
      publishedPosts: "Published posts",
      published: "Published",
      readMore: "Read more",
      backToBlog: "← Back to Blog",
      noPostsYet: "No posts yet.",
      noPostsDescription:
        "New posts will appear here once they are added.",
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
        "A place to share films, music, books, anime, games, and other works I like, along with short notes on how they felt at the time.",
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
      addedToCollection: "Added to collection",
      unknown: "Unknown",
      unknownCreator: "Unknown creator",
      releasedIn: "Released in",
      noCover: "No Cover",
      coverImageLabelSuffix: " cover image",
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
        "Photos from trips, ordinary days, and small moments worth keeping.",
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
        "New photos will appear here once they are added.",
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
        "Search by post title, media name, photo location, or any detail you remember.",
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
      about: "关于",
      blog: "博客",
      posts: "全部文章",
      archives: "归档",
      categories: "分类",
      tags: "标签",
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
    adminLogin: {
      backToHome: "← 返回首页",
      eyebrow: "后台登录",
      title: "登录 NEON MOON",
      description: "使用私密后台密码打开管理首页。",
      passwordLabel: "后台密码",
      passwordPlaceholder: "输入密码",
      submit: "登录",
      errors: {
        invalid: "后台密码无效。",
        missingSecret: "后台会话密钥尚未配置。",
        missingPassword: "后台密码尚未配置。",
        invalidRequest: "无法读取登录请求，请重试。",
      },
    },
    home: {
      eyebrow: "NEON MOON",
      poemLine: "春江潮水连海平，海上明月共潮生。",
      poemSource: "—— 张若虚《春江花月夜》",
      poemTranslation: "",
      title: "欢迎来到 Neon Moon",
      description:
        "网络海洋里的一座宁静小岛，安静存放我的文章、照片、媒体收藏和一些慢慢生长的想法。",
      scrollLabel: "向下滚动",
    },
    about: {
      eyebrow: "关于 NEON MOON",
      heroTitle: "NEON MOON",
      heroSubtitle:
        "一个用来存放文章、照片、媒体记录和安静想法的个人档案馆。",
      avatarLabel: "Louis 的头像",
      profileName: "Louis",
      profileLine:
        "慢慢搭建一个小而稳定、能够长期使用的个人网站。",
      identity: [
        {
          label: "名字",
          value: "Louis",
        },
        {
          label: "身份",
          value: "IT 学生，正在搭建自己的长期个人网站",
        },
      ],
      introEyebrow: "个人空间",
      introTitle: "一个仍在慢慢生长的安静页面。",
      introParagraphs: [
        "我希望把这个网站做成一个长期使用的个人空间，用来记录文章、媒体笔记、旅行照片，以及那些需要一个地方慢慢存放的小想法。",
        "NEON MOON 不需要很夸张。它只要足够有用、足够个人，并且可以随着时间继续改进。",
      ],
      educationTitle: "教育经历",
      educationIntro: "简洁记录学习背景，把它作为个人档案的一部分保留下来。",
      education: [
        {
          school: "University of Queensland",
          program: "Master of Information Technology",
          years: "2026 -",
          note: "当前研究生阶段，学习信息技术，也关注实用网页工具如何被规划、搭建和长期维护。",
        },
        {
          school: "McMaster University",
          program: "商科金融方向背景，辅修数学",
          years: "已完成",
          note: "商科与金融训练，加上数学辅修背景，影响了我理解数据、产品和研究问题的方式。",
        },
      ],
      skillsTitle: "技能",
      skillsIntro: "构建和维护这个网站会用到的实用工具箱。这里是状态记录，不是能力打分。",
      skillGroups: [
        {
          title: "前端",
          items: [
            {
              name: "HTML",
              level: 70,
              note: "页面结构",
            },
            {
              name: "React",
              level: 76,
              note: "产品界面",
            },
            {
              name: "Next.js App Router",
              level: 74,
              note: "站点结构",
            },
            {
              name: "TypeScript",
              level: 72,
              note: "类型安全",
            },
            {
              name: "Tailwind CSS",
              level: 70,
              note: "样式系统",
            },
          ],
        },
        {
          title: "网站实践",
          items: [
            {
              name: "文章页面",
              level: 68,
              note: "整理写作",
            },
            {
              name: "私密编辑",
              level: 66,
              note: "保持更新有序",
            },
            {
              name: "隐私基础",
              level: 62,
              note: "谨慎访问",
            },
            {
              name: "响应式页面",
              level: 65,
              note: "桌面与移动端",
            },
          ],
        },
        {
          title: "编程",
          items: [
            {
              name: "Java",
              level: 62,
              note: "学习中",
            },
            {
              name: "Python",
              level: 64,
              note: "脚本",
            },
            {
              name: "JavaScript",
              level: 68,
              note: "浏览器逻辑",
            },
            {
              name: "TypeScript",
              level: 72,
              note: "类型应用",
            },
          ],
        },
        {
          title: "工具",
          items: [
            {
              name: "Git",
              level: 70,
              note: "版本管理",
            },
            {
              name: "GitHub",
              level: 68,
              note: "仓库流程",
            },
            {
              name: "Docker",
              level: 60,
              note: "部署学习中",
            },
            {
              name: "Oracle Cloud",
              level: 52,
              note: "VPS 学习中",
            },
          ],
        },
      ],
      languagesTitle: "语言能力",
      languagesIntro: "按真实使用场景来描述：学习、阅读、写作和日常沟通。",
      languages: [
        {
          name: "简体中文",
          level: "母语",
          note: "日常思考和写作",
          value: 96,
        },
        {
          name: "繁体中文",
          level: "阅读",
          note: "阅读较顺畅",
          value: 78,
        },
        {
          name: "英文",
          level: "学习和学术使用",
          note: "学习、研究和项目",
          value: 86,
        },
        {
          name: "日语",
          level: "初学，学习中",
          note: "初学阶段",
          value: 28,
        },
        {
          name: "法语",
          level: "初学，学习中",
          note: "初学阶段",
          value: 20,
        },
      ],
      interestsTitle: "兴趣爱好",
      interestsIntro: "一些我会反复回到的主题。",
      interests: [
        "摄影",
        "电影",
        "动画",
        "游戏",
        "历史",
        "文学小说",
      ],
      quoteTitle: "座右铭",
      quote: "吾志所向，一往无前；愈挫愈奋，再接再厉。",
      quoteAuthor: "孙文",
    },
    adminDashboard: {
      eyebrow: "后台首页",
      title: "管理你的 NEON MOON 内容",
      description: "用于管理博客文章、媒体收藏和照片上传的私密入口。",
      backToHome: "← 返回首页",
      cardKicker: "后台",
      directNoticePrefix: "此页面不会显示在公开导航栏中，请直接通过 ",
      directNoticeSuffix: " 访问。",
      cards: {
        blog: {
          title: "博客文章",
          description: "创建、编辑、发布、取消发布和管理个人博客文章。",
          label: "打开博客管理",
          quickLabel: "新建文章",
        },
        media: {
          title: "媒体收藏",
          description: "创建、编辑、删除和管理电影、音乐、书籍、动画与游戏。",
          label: "打开媒体管理",
          quickLabel: "添加媒体项目",
        },
        photos: {
          title: "照片",
          description: "查看照片记录、上传新图片并管理图库元数据。",
          label: "打开照片管理",
          quickLabel: "上传照片",
        },
      },
    },
    blogAdmin: {
      adminName: "博客管理",
      viewPublicBlog: "查看公开博客",
      backToBlogAdmin: "返回博客管理",
      manageTitle: "管理博客文章",
      manageDescription: "查看数据库中保存的已发布文章和草稿。",
      createTitle: "创建新文章",
      createDescription: "从后台创建新的博客文章，并保存到数据库。",
      editTitle: "编辑博客文章",
      editDescription: "更新已有文章、修改发布状态，并把改动保存回数据库。",
      newPost: "新建文章",
      loadingPosts: "正在加载博客文章...",
      postSingular: "篇文章",
      postPlural: "篇文章",
      foundSuffix: "已找到。",
      all: "全部",
      published: "已发布",
      draft: "草稿",
      noPostsInView: "当前视图没有文章。",
      noPostsHint: "切换筛选条件，或创建一篇新的博客文章。",
      title: "标题",
      slug: "链接别名",
      status: "状态",
      updated: "更新时间",
      createdOn: "创建于",
      edit: "编辑",
      view: "查看",
      updating: "正在更新...",
      unpublish: "取消发布",
      publish: "发布",
      invalidPostId: "博客文章 id 无效。",
      loadingPost: "正在加载博客文章...",
      postCouldNotLoad: "无法加载这篇博客文章。",
      editingPostPrefix: "正在编辑文章",
      lastUpdatedOn: "最后更新于",
      titlePlaceholder: "输入博客标题",
      slugPlaceholder: "输入 URL slug",
      excerpt: "摘要",
      excerptPlaceholder: "写一段简短摘要...",
      category: "分类",
      categoryPlaceholder: "可选分类，例如：旅行",
      tags: "标签",
      tagsPlaceholder: "旅行，日本，随笔",
      tagsHelp: "多个标签用逗号分隔。",
      coverImageUrl: "封面图片链接",
      coverImageUrlPlaceholder: "可选的封面图片路径",
      content: "正文",
      contentPlaceholder: "在这里写完整博客正文...",
      slugCreateHelp: "用于 URL。请使用字母、数字和连字符。",
      slugEditHelp: "用于 URL。修改后，公开博客文章 URL 也会改变。",
      publishImmediately: "立即发布这篇文章",
      publishThisPost: "发布这篇文章",
      creating: "正在创建...",
      createPost: "创建博客文章",
      saving: "正在保存...",
      saveChanges: "更新文章",
      failedToLoadPosts: "博客文章加载失败。",
      failedToLoadPostsUnexpected: "加载博客文章时发生错误。",
      failedToUpdatePublishStatus: "发布状态更新失败。",
      publishStatusMissing: "发布状态响应缺少文章数据。",
      failedToUpdatePublishStatusUnexpected: "更新发布状态时发生错误。",
      failedToCreatePost: "博客文章创建失败。",
      failedToCreatePostUnexpected: "创建博客文章时发生错误。",
      failedToLoadPost: "博客文章加载失败。",
      failedToLoadPostUnexpected: "加载博客文章时发生错误。",
      failedToUpdatePost: "博客文章更新失败。",
      failedToUpdatePostUnexpected: "更新博客文章时发生错误。",
    },
    mediaAdmin: {
      adminName: "媒体管理",
      viewPublicMedia: "查看公开媒体收藏",
      backToMediaAdmin: "返回媒体管理",
      manageTitle: "管理媒体收藏",
      manageDescription: "查看、编辑、新建和删除数据库中保存的媒体收藏。",
      createTitle: "添加新的媒体项目",
      createDescription: "把电影、音乐、书籍、动画或游戏添加到你的个人媒体收藏。",
      editTitle: "编辑媒体条目",
      editDescription: "更新这条媒体的标题、分类、创作者、发行年份、评分、封面 URL 和个人备注。",
      newMediaItem: "新建媒体项目",
      loadingMediaItems: "正在加载媒体条目...",
      itemSingular: "条记录",
      itemPlural: "条记录",
      foundSuffix: "已找到。",
      noMediaItemsInView: "当前视图没有媒体条目。",
      noMediaItemsHint: "切换筛选条件，或添加新的媒体条目。",
      title: "标题",
      category: "分类",
      creator: "创作者",
      rating: "评分",
      actions: "操作",
      releasedIn: "发行于",
      updatedOn: "更新于",
      createdOn: "创建于",
      unknown: "未知",
      notRated: "未评分",
      edit: "编辑",
      deleting: "正在删除...",
      delete: "删除",
      deleteConfirmPrefix: "删除“",
      deleteConfirmSuffix: "”？此操作无法撤销。",
      releaseYear: "发行年份",
      coverUrl: "封面 URL",
      note: "备注",
      titlePlaceholder: "输入标题",
      creatorPlaceholder: "导演、艺术家、作者、工作室...",
      releaseYearPlaceholder: "可选的发行年份",
      ratingPlaceholder: "可选评分，0 到 10",
      coverUrlPlaceholder: "可选的封面图片路径或 URL",
      notePlaceholder: "写一段关于这条媒体的简短备注...",
      editingItemPrefix: "正在编辑媒体条目",
      loadingMediaItem: "正在加载媒体条目...",
      creating: "正在创建...",
      createMediaItem: "创建媒体项目",
      saving: "正在保存...",
      saveChanges: "更新媒体项目",
      categories: {
        all: "全部",
        music: "音乐",
        book: "书籍",
        movie: "电影",
        anime: "动画",
        game: "游戏",
      },
      failedToLoadMediaItems: "媒体条目加载失败。",
      failedToLoadMediaItemsUnexpected: "加载媒体条目时发生错误。",
      failedToDeleteMediaItem: "媒体条目删除失败。",
      failedToDeleteMediaItemUnexpected: "删除媒体条目时发生错误。",
      failedToCreateMediaItem: "媒体条目创建失败。",
      failedToCreateMediaItemUnexpected: "创建媒体条目时发生错误。",
      failedToLoadMediaItem: "媒体条目加载失败。",
      mediaItemMissing: "媒体条目响应缺少数据。",
      failedToLoadMediaItemUnexpected: "加载媒体条目时发生错误。",
      failedToUpdateMediaItem: "媒体条目更新失败。",
      failedToUpdateMediaItemUnexpected: "更新媒体条目时发生错误。",
    },
    photosAdmin: {
      adminName: "照片管理",
      viewPublicGallery: "查看公开相册",
      backToPhotosAdmin: "返回照片管理",
      viewPublicPhoto: "查看公开照片",
      manageTitle: "管理照片",
      manageDescription: "查看和管理数据库中保存的照片记录。",
      uploadEyebrow: "上传照片",
      uploadTitle: "添加新照片",
      uploadDescription: "上传本地图片文件，并把照片信息保存到数据库。",
      editEyebrow: "编辑照片",
      editTitle: "更新照片详情",
      editDescription: "编辑这张照片的数据库记录，不改变公开相册导航。",
      uploadPhoto: "上传照片",
      loadingPhotos: "正在加载照片...",
      photoSingular: "张照片",
      photoPlural: "张照片",
      foundSuffix: "已找到。",
      noPhotosFound: "没有找到照片。",
      noPhotosHint: "上传一张照片，开始建立相册。",
      photoNumberPrefix: "照片 #",
      imagePreviewSuffix: " 图片预览",
      location: "地点",
      taken: "拍摄",
      updated: "更新",
      unknown: "未知",
      view: "查看",
      edit: "编辑",
      deleting: "正在删除...",
      delete: "删除",
      deleteConfirmPrefix: "删除“",
      deleteConfirmSuffix: "”？此操作无法撤销。",
      deletedSuccessfully: "照片已删除。",
      imageFile: "图片文件",
      chooseFile: "选择文件",
      noFileSelected: "未选择文件",
      supportedFormats: "支持格式：JPG、PNG、WEBP。最大 8MB。",
      title: "标题",
      titlePlaceholder: "输入照片标题",
      imageUrl: "图片 URL",
      locationPlaceholder: "输入地点",
      takenDate: "拍摄日期",
      descriptionLabel: "描述",
      descriptionPlaceholder: "写一段关于这张照片的简短备注...",
      uploading: "正在上传...",
      loadingPhotoDetails: "正在加载照片详情...",
      returnToPhotosAdmin: "返回照片管理",
      editingPhotoPrefix: "正在编辑照片",
      saving: "正在保存...",
      saveChanges: "更新照片",
      validPhotoIdRequired: "需要有效的照片 id。",
      failedToLoadPhotos: "照片加载失败。",
      failedToLoadPhotosUnexpected: "加载照片时发生错误。",
      failedToDeletePhoto: "照片删除失败。",
      failedToDeletePhotoUnexpected: "删除照片时发生错误。",
      failedToUploadPhoto: "照片上传失败。",
      failedToUploadPhotoUnexpected: "上传照片时发生错误。",
      failedToLoadPhotoDetails: "照片详情加载失败。",
      photoDetailsMissing: "照片详情响应缺少数据。",
      failedToLoadPhotoUnexpected: "加载照片时发生错误。",
      failedToUpdatePhoto: "照片更新失败。",
      failedToSavePhotoUnexpected: "保存照片时发生错误。",
    },
    blog: {
      eyebrow: "博客",
      title: "生活记录、随笔和项目更新",
      description: "记录生活思考、旅游见闻和项目更新的个人写作空间。",
      post: "篇文章",
      posts: "文章",
      archives: "归档",
      archiveDescription:
        "按月份收起旧文章，像给这个网站留下一层安静的书架。",
      categories: "分类",
      categoriesDescription: "用几个较大的主题整理相关的文章。",
      tags: "标签",
      tagsDescription: "用更细的小线索串起不同时候的记录。",
      category: "分类",
      categoryDetailDescription: "收在这个主题下的文章。",
      tagDetailDescription: "由这个标签连接起来的记录。",
      noPostsInCategory: "这个分类下暂时没有公开文章。",
      noPostsWithTag: "这个标签下暂时没有公开文章。",
      backToCategories: "← 返回分类",
      backToTags: "← 返回标签",
      latestPosts: "最新文章",
      publishedPosts: "已发布文章",
      published: "已发布",
      readMore: "阅读更多",
      backToBlog: "← 返回博客",
      noPostsYet: "暂无文章。",
      noPostsDescription: "新的文章会在添加后出现在这里。",
      blogPost: "博客文章",
      postedOn: "发布于",
      updatedOn: "更新于",
    },
    media: {
      eyebrow: "媒体收藏",
      collection: "收藏",
      mediaCollection: "媒体收藏",
      title: "电影、音乐、书籍、动画和游戏",
      description: "分享我喜欢的电影、音乐、书籍、动画、游戏和其他作品，也记录一些当时的感受。",
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
      addedToCollection: "加入收藏",
      unknown: "未知",
      unknownCreator: "未知创作者",
      releasedIn: "发行于",
      noCover: "无封面",
      coverImageLabelSuffix: " 封面图片",
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
      description: "一些来自旅途、日常和小瞬间的照片记录。",
      photoDetail: "照片详情",
      location: "地点",
      takenAt: "拍摄时间",
      descriptionLabel: "描述",
      viewPhoto: "查看照片",
      viewDetails: "查看详情",
      backToPhotos: "← 返回相册",
      backToGallery: "← 返回图库",
      noPhotosYet: "暂无照片。",
      noPhotosDescription: "新的照片会在添加后出现在这里。",
    },
    search: {
      eyebrow: "搜索",
      title: "搜索 NEON MOON",
      description: "搜索文章、媒体收藏和照片。",
      queryLabel: "搜索关键词",
      placeholder: "输入关键词",
      button: "搜索",
      noQueryTitle: "输入关键词开始搜索。",
      noQueryDescription:
        "可以搜索文章标题、媒体名称、照片地点，或者你记得的关键词。",
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

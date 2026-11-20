export interface IPurchaseLink {
  store: string;
  url: string;
}

export interface IExcerpt {
  title: string;
  text: string;
}

export interface IBook {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  coverImage: string;
  galleryImages: string[];
  synopsis: string;
  genre: string;
  themes: string[];
  publicationDate?: string;
  publisher?: string;
  isbn?: string;
  pageCount?: number;
  status: 'published' | 'coming_soon' | 'work_in_progress' | 'archived';
  purchaseLinks: IPurchaseLink[];
  authorNotes?: string;
  excerpts: IExcerpt[];
  associatedCharacters?: ICharacter[];
  featured: boolean;
  readingGuideUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICharacterRelationship {
  relatedCharacter: {
    _id: string;
    name: string;
    slug: string;
    portraitUrl: string;
    archetype?: string;
  };
  relationType: string;
  notes?: string;
}

export interface ICharacter {
  _id: string;
  name: string;
  slug: string;
  portraitUrl: string;
  archetype: string;
  book: IBook | string;
  background: string;
  personalityTraits: string[];
  motivations: string;
  memorableQuotes: string[];
  relationships: ICharacterRelationship[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IJournalPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: 'Essays' | 'On Writing' | 'Reflections' | 'Behind the Quill';
  tags: string[];
  readingTimeMinutes: number;
  status: 'draft' | 'published';
  publishedAt?: string;
  relatedBooks?: IBook[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IReaderLetter {
  _id?: string;
  id?: string;
  senderName: string;
  senderEmail?: string;
  isAnonymous: boolean;
  bookReferenced?: IBook | { _id: string; title: string; slug: string; coverImage?: string };
  subject: string;
  message: string;
  consentToPublish?: boolean;
  status?: 'pending' | 'approved' | 'private' | 'replied';
  authorReply?: string;
  repliedAt?: string;
  featured?: boolean;
  createdAt: string;
}

export interface ITestimonial {
  _id: string;
  quote: string;
  attribution: string;
  source: 'Author' | 'Critic' | 'Publication' | 'Reader';
  bookReferenced?: { _id: string; title: string; slug: string };
  featured: boolean;
  createdAt: string;
}

export interface IEvent {
  _id: string;
  title: string;
  eventType: 'Book Launch' | 'Literary Festival' | 'Reading' | 'Interview' | 'Media';
  date: string;
  timeString?: string;
  venue: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  description: string;
  registrationUrl?: string;
  status: 'upcoming' | 'past' | 'cancelled';
  featured: boolean;
  createdAt: string;
}

export interface IMedia {
  _id: string;
  url: string;
  publicId?: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  folder: string;
  isCloudinary: boolean;
  createdAt: string;
}

export interface IDailyFragment {
  quote: string;
  workTitle: string;
  commentary?: string;
  dateString?: string;
}

export interface ISiteSettings {
  _id?: string;
  dailyFragment: IDailyFragment;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  authorBioSummary: string;
  authorPhilosophy: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    goodreads?: string;
    substack?: string;
  };
  literaryAgent: {
    name: string;
    agency: string;
    email: string;
  };
  pressKitUrl?: string;
  readingGuides: Array<{
    title: string;
    description: string;
    fileUrl: string;
    bookTitle: string;
  }>;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'admin';
  avatarUrl?: string;
}

export interface IDashboardStats {
  metrics: {
    totalBooks: number;
    publishedBooks: number;
    wipBooks: number;
    totalCharacters: number;
    totalPosts: number;
    draftPosts: number;
    pendingLetters: number;
    totalLetters: number;
    upcomingEvents: number;
    totalTestimonials: number;
  };
  recentPendingLetters: IReaderLetter[];
  recentPosts: Array<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    category: string;
    publishedAt: string;
    views: number;
  }>;
}

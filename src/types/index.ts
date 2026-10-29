// Artist data types

export interface Artist {
  // Core artist fields
  id: string;
  slug: string;
  professional_name: string;
  category: string;
  profile_pic: string;

  // Artist card details
  duration?: string;
  performance_duration?: string;
  languages?: string[] | string;

  // Existing artist details
  genres?: string[];
  location?: string;
  rating?: number;
  reviews_count?: number;
  starting_price?: number;
  experience_years?: number;
  tagline?: string;
  verified?: boolean;

  // Fields from your original API response
  profile_completion_score?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  user_type_label?: string;
  formatted_created_at?: string;
  live?: string;
}


// Budget brackets
export interface BudgetBracket {
  id: string;
  label: string;
  description: string;
  lower: number;
  upper: number | null;
  advanceStandard: number;
  advanceFirst10: number;
  displayLabel: string;
}

// Wizard state
export interface WizardData {
  // Step 1: Artist type
  artistType?: string;
  // Step 2: Location & Event Type
  city?: string;
  eventType?: string;
  // Step 3: Budget
  budget?: BudgetBracket;
  // Step 4: Date & Time
  eventDate?: string;
  eventTime?: string;
  // Step 5: Sound & Rider
  soundRequirements?: string;
  // Step 6: Customer Details
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  venueAddress?: string;
  couponCode?: string;
  termsAccepted?: boolean;
  // Selected artist (from browse)
  selectedArtist?: Artist;
  // Lead/booking metadata
  leadId?: string;
  submissionKey?: string;
}

// Firestore document types
export interface LeadDocument {
  leadId: string;
  submissionKey: string;
  uid?: string;
  artistType: string;
  city: string;
  eventType: string;
  budgetLabel: string;
  budgetLower: number;
  budgetUpper: number | null;
  advanceAmount: number;
  couponCode?: string;
  eventDate?: string;
  eventTime?: string;
  soundRequirements?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  venueAddress?: string;
  selectedArtistId?: string;
  selectedArtistName?: string;
  status: LeadStatus;
  createdAt: import('firebase/firestore').Timestamp;
  updatedAt: import('firebase/firestore').Timestamp;
}

export type LeadStatus = 'enquiry_saved' | 'under_review' | 'matched' | 'confirmed' | 'cancelled';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  createdAt: import('firebase/firestore').Timestamp;
  updatedAt: import('firebase/firestore').Timestamp;
}

// Auth types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

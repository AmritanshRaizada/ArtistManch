
import type { Artist, BudgetBracket } from '../types';

export const ARTIST_CATEGORIES = [
  'All Categories',
  'Celebrity Appearance',
  'Comedian',
  'Dancer/Troupe',
  'DJ',
  'Anchor/Emcee',
  'Instrumentalist',
  'Live Band',
  'Magician',
  'Make-up Artist/Stylist',
  'Model',
  'Photo/Videographer',
  'Singer',
  'Speaker',
  'Variety Artist',
  'Influencer',
];

export const ARTISTS: Artist[] = [
  {
    id: 'praveen-meena',
    slug: 'praveen-meena',
    professional_name: 'Praveen Meena',
    category: 'Singer',
    profile_pic: '',
  },
  {
    id: 'vincy-wilson',
    slug: 'vincy-wilson',
    professional_name: 'Vincy Wilson',
    category: 'Anchor/Emcee',
    profile_pic: '',
  },
  {
    id: 'khushbu-gopi',
    slug: 'khushbu-gopi',
    professional_name: 'Khushbu gopi',
    category: 'Singer',
    profile_pic: '',
  },
  {
    id: 'i_amuryaprakash',
    slug: 'i_amuryaprakash',
    professional_name: 'I_amuryaprakash',
    category: 'Anchor/Emcee',
    profile_pic: '',
  },
  {
    id: 'sugam-sarkar',
    slug: 'sugam-sarkar',
    professional_name: 'Sugam sarkar',
    category: 'Singer',
    profile_pic: '',
  },
  {
    id: 'self',
    slug: 'self',
    professional_name: 'Self',
    category: 'Singer',
    profile_pic: '',
  },
  {
    id: 'sashmitha',
    slug: 'sashmitha',
    professional_name: 'Sashmitha',
    category: 'Anchor/Emcee',
    profile_pic: '',
  },
  {
    id: 'mahii',
    slug: 'mahii',
    professional_name: 'Mahii',
    category: 'Anchor/Emcee',
    profile_pic: '',
  },
  {
    id: 'ansar-ali',
    slug: 'ansar-ali',
    professional_name: 'Ansar Ali',
    category: 'Singer',
    profile_pic: '',
  },
  {
    id: 'prashant-raghuwanshi',
    slug: 'prashant-raghuwanshi',
    professional_name: 'Prashant raghuwanshi',
    category: 'Singer',
    profile_pic: '',
  },
];

export const BUDGET_BRACKETS: BudgetBracket[] = [
  {
    id: 'b1',
    label: 'Acoustic / Solo Vocal',
    description:
      'Perfect for intimate dinner parties, housewarmings, or birthday acoustics.',
    lower: 4500,
    upper: 8000,
    advanceStandard: 900,
    advanceFirst10: 450,
    displayLabel: '₹4,500 – ₹8,000',
  },
  {
    id: 'b2',
    label: 'Duo Act / Ghazal Singer',
    description:
      'Well-suited for cocktail evenings, anniversary celebrations, and private lounges.',
    lower: 8000,
    upper: 12000,
    advanceStandard: 1600,
    advanceFirst10: 800,
    displayLabel: '₹8,000 – ₹12,000',
  },
  {
    id: 'b3',
    label: 'Celebrity Vocalist / Trio',
    description:
      'High-energy Sufi-Bollywood sets, grand Sangeet nights & premium receptions.',
    lower: 12000,
    upper: 15000,
    advanceStandard: 2400,
    advanceFirst10: 1200,
    displayLabel: '₹12,000 – ₹15,000',
  },
  {
    id: 'b4',
    label: 'Live 4-Piece Band',
    description:
      'Full rhythm section, lead vocal, percussionist, and state-of-the-art monitor rig.',
    lower: 15000,
    upper: 25000,
    advanceStandard: 3000,
    advanceFirst10: 1500,
    displayLabel: '₹15,000 – ₹25,000',
  },
  {
    id: 'b5',
    label: 'Renowned Concert Maestro',
    description:
      'National festival touring performers, orchestral ensembles, and headline acts.',
    lower: 25000,
    upper: 50000,
    advanceStandard: 5000,
    advanceFirst10: 2500,
    displayLabel: '₹25,000 – ₹50,000',
  },
  {
    id: 'b6',
    label: 'Celebrity Playback / Grand Gala',
    description:
      'Bollywood touring artists, bespoke production riders, and arena-grade lighting.',
    lower: 50000,
    upper: null,
    advanceStandard: 10000,
    advanceFirst10: 5000,
    displayLabel: '₹50,000+',
  },
];

export const EVENT_TYPES = [
  'Grand Wedding Sangeet',
  'Cocktail & Private Reception',
  'Corporate Annual Gala',
  'Luxury Anniversary Celebration',
  'Campus / Cultural Fest',
  'Birthday Celebration',
  'Housewarming Ceremony',
  'Festival / Mela',
];

export const ARTIST_TYPES = [
  {
    value: 'Singer / Band',
    icon: 'mic',
    subtitle: 'Bollywood & Sufi',
  },
  {
    value: 'Anchor / Emcee',
    icon: 'podium',
    subtitle: 'Luxury Galas',
  },
  {
    value: 'Instrumentalist',
    icon: 'piano',
    subtitle: 'Sitar, Violin, Flute',
  },
  {
    value: 'Full Troupe',
    icon: 'celebration',
    subtitle: 'Sangeet Orchestra',
  },
];

export const MAJOR_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Udaipur',
  'Pune',
  'Ahmedabad',
  'Goa',
  'Chandigarh',
  'Lucknow',
  'Bhopal',
  'Kochi',
];

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

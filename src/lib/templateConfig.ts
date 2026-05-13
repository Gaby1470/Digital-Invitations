// src/lib/templateConfig.ts
import { TemplateConfig } from './types';

export const templateConfig: { [key: string]: TemplateConfig } = {
  'timeline-wedding': {
    name: 'Timeline Wedding',
    category: 'Wedding',
    description: 'A beautiful, scrolling story of your special day.',
    font: 'font-serif',
    defaultFont: 'Playfair Display',
    fonts: ['Playfair Display', 'Lora', 'Merriweather', 'Cormorant Garamond'],
    palettes: [
      { name: 'Amethyst', primary: '#6d28d9', text: '#374151' },
      { name: 'Rose Gold', primary: '#b45309', text: '#4b5563' },
      { name: 'Emerald', primary: '#047857', text: '#374151' },
    ],
    defaultData: {
      primaryColor: '#6d28d9',
      textColor: '#374151',
      heroTitle: 'The Wedding Of',
      heroNames: 'Gaby & Emilio',
      timelineTitle: 'Our Wedding Day',
      galleryTitle: 'Our Story',
      dressCode: { title: 'Dress Code', description: 'Formal Attire' },
      mainVenueAddress: "123 Main Street, Anytown, USA",
      galleryImages: [
        "https://picsum.photos/seed/gallery1/800/600",
        "https://picsum.photos/seed/gallery2/800/600",
        "https://picsum.photos/seed/gallery3/800/600",
      ],
      lodgingAndTravel: [
        { name: "The Grand Hotel", description: "5-star hotel near the venue.", link: "#" },
        { name: "City Center Inn", description: "Affordable option downtown.", link: "#" },
      ],
      timelineItems: [
        { time: "3 PM", title: "Ceremony", location: "St. Mary's Church" },
        { time: "4 PM", title: "Reception", location: "The Grand Hall Gardens" },
        { time: "9 PM", title: "Tornaboda", location: "Hacienda San Jose" },
      ],
    },
    features: {
      multiEventSchedule: true,
      countdown: { type: 'flip-clock' },
      lodgingAndTravel: true,
      digitalRegistry: { enabled: true, types: ['amazon', 'cash_fund'] },
      songRequests: true,
    },
  },
  'quinceanera-dream': {
    name: 'Quinceañera Dream',
    category: 'XV Years',
    description: 'A magical celebration for a special fifteenth birthday.',
    font: 'font-serif',
    defaultFont: 'Dancing Script',
    fonts: ['Dancing Script', 'Great Vibes', 'Parisienne', 'Alex Brush'],
    palettes: [
      { name: 'Pink Dream', primary: '#db2777', text: '#374151' },
      { name: 'Royal Gold', primary: '#ca8a04', text: '#4b5563' },
      { name: 'Lilac', primary: '#8b5cf6', text: '#f9fafb' },
    ],
    defaultData: {
      primaryColor: '#db2777',
      textColor: '#374151',
      heroTitle: "You're Invited to the XV of",
      heroNames: 'Valentina',
      timelineTitle: 'The Celebration',
      galleryTitle: 'My XV Album',
      courtOfHonor: [
        { name: 'Mateo', role: 'Chambelán', photoUrl: 'https://i.pravatar.cc/150?u=mateo' },
        { name: 'Sofia', role: 'Dama', photoUrl: 'https://i.pravatar.cc/150?u=sofia' },
      ],
      timelineItems: [
        { time: "5 PM", title: "Mass", location: "San Juan Bautista Church" },
        { time: "7 PM", title: "Reception", location: "Crystal Palace Ballroom" },
        { time: "9 PM", title: "Last Toy & Crowning", location: "Crystal Palace Ballroom" },
      ],
    },
    features: {
      courtOfHonor: true,
      uniqueCeremonies: true,
      socialMediaWall: true,
    },
  },
  'kids-birthday-bash': {
    name: 'Kids Birthday Bash',
    category: 'Birthday',
    description: "A fun and themed party for the little ones.",
    font: 'font-sans',
    defaultFont: 'Nunito',
    fonts: ['Nunito', 'Quicksand', 'Comfortaa', 'Fredoka One'],
    palettes: [
      { name: 'Superhero', primary: '#2563eb', text: '#1f2937' },
      { name: 'Dinosaur', primary: '#16a34a', text: '#f9fafb' },
      { name: 'Unicorn', primary: '#ec4899', text: '#fdf4ff' },
    ],
    defaultData: {
      primaryColor: '#2563eb',
      textColor: '#1f2937',
      heroTitle: "Join us to Celebrate",
      heroNames: "Leo's 5th Birthday!",
      timelineTitle: 'Party Time!',
      timelineItems: [
        { time: "2 PM", title: "Games & Fun", location: "JumpZone Play Park" },
        { time: "4 PM", title: "Cake & Presents", location: "JumpZone Party Room" },
      ],
      parentalNotes: "Socks are required for the play area. Pick up is at 5 PM."
    },
    features: {
      ageSpecificThemes: ['superhero', 'boho'],
      parentalNotes: true,
      allergyTracker: true,
    },
  },
   'gender-reveal-party': {
    name: 'Gender Reveal Party',
    category: 'Baby Shower',
    description: 'He or She? Come and see! A fun party to reveal the gender of our baby.',
    font: 'font-sans',
    defaultFont: 'Montserrat',
    fonts: ['Montserrat', 'Poppins', 'Lato', 'Open Sans'],
    palettes: [
      { name: 'Blue & Pink', primary: '#3b82f6', text: '#ec4899' },
      { name: 'Pastel', primary: '#a78bfa', text: '#fde68a' },
      { name: 'Mint & Gold', primary: '#10b981', text: '#f59e0b' },
    ],
    defaultData: {
      primaryColor: '#3b82f6',
      textColor: '#ec4899',
      heroTitle: "He or She? Come and See!",
      heroNames: "Baby Smith",
      timelineTitle: 'Party Details',
      timelineItems: [
        { time: "2 PM", title: "Arrival & Welcome", location: "Our Home" },
        { time: "3 PM", title: "The Big Reveal!", location: "The Backyard" },
        { time: "3:30 PM", title: "Celebrations & Cake", location: "Our Home" },
      ],
    },
    features: {
      genderBetting: true,
      diaperRaffle: false,
    },
  },
  'graduation-celebration': {
    name: 'Graduation Celebration',
    category: 'Graduation',
    description: 'A celebration of achievement and new beginnings.',
    font: 'font-sans',
    defaultFont: 'Roboto Slab',
    fonts: ['Roboto Slab', 'Oswald', 'Anton', 'Bebas Neue'],
    palettes: [
      { name: 'Classic', primary: '#ca8a04', text: '#f9fafb' },
      { name: 'Modern', primary: '#4f46e5', text: '#e5e7eb' },
      { name: 'Bold', primary: '#be123c', text: '#f1f5f9' },
    ],
    defaultData: {
      primaryColor: '#ca8a04',
      textColor: '#f9fafb',
      heroTitle: "Celebrating the Graduation of",
      heroNames: "Alex Doe",
      timelineTitle: 'Event Schedule',
      timelineItems: [
        { time: "6 PM", title: "Dinner & Toasts", location: "The Graduate's Home" },
        { time: "8 PM", title: "Party", location: "The Graduate's Home" },
      ],
      tribute: "A heartfelt thank you to my family, friends, and teachers for their endless support.",
      futurePlans: "Next stop: University of Innovation to study Computer Science!",
    },
    features: {
      tributeSection: true,
      futurePlans: true,
    },
  },
};

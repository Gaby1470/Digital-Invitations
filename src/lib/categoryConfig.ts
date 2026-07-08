import { StaticImageData } from 'next/image';
import weddingIcon from '../../public/wedding-icon.png';
import babyIcon from '../../public/baby-icon.png';
import baptismIcon from '../../public/baptism-icon.png';
import businessIcon from '../../public/business-icon.png';
import gradIcon from '../../public/grad-icon.png';
import quinceIcon from '../../public/quince-icon.png';
import partyIcon from '../../public/party-icon.png';

export interface Category {
  name: string;
  href: string;
  icon: string | StaticImageData;
}

export const categories: Category[] = [
  { name: 'Bodas', href: '/templates', icon: weddingIcon },
  { name: 'Cumpleaños', href: '/templates', icon: partyIcon },
  { name: 'Baby Shower', href: '/templates', icon: babyIcon },
  { name: 'Graduaciones', href: '/templates', icon: gradIcon },
  { name: 'XV Años', href: '/templates', icon: quinceIcon },
  { name: 'Bautizos', href: '/templates', icon: baptismIcon },
  { name: 'Corporativos', href: '/templates', icon: businessIcon },
];

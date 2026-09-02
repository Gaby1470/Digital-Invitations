import TemplatesClientPage from './client-page';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plantillas de Invitaciones Digitales | Tap 2 Invite",
  description: "Explora nuestra colección de plantillas de invitaciones digitales para bodas, cumpleaños, baby showers y más. Encuentra el diseño perfecto para tu evento.",
};

export default function TemplatesPage() {
  return <TemplatesClientPage />;
}

import { templateConfig } from '@/lib/templateConfig';
import { templateShareImage } from '@/lib/seo';
import TemplatePreviewClientPage from './client-page';
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ templateName: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { templateName } = await params
  const template = templateConfig[templateName]

  if (!template) {
    return {
      title: 'Plantilla no encontrada',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${template.name} | Tap 2 Invite`,
    description: template.description,
    openGraph: {
      images: [{ url: templateShareImage(template.thumbnail), width: 1200, height: 630 }, ...previousImages],
    },
  }
}

export default function TemplatePreviewPage() {
  return <TemplatePreviewClientPage />;
}

import { templateConfig } from '@/lib/templateConfig';
import TemplatePreviewClientPage from './client-page';
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { templateName: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const templateName = params.templateName
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
      images: [template.thumbnail, ...previousImages],
    },
  }
}

export default function TemplatePreviewPage() {
  return <TemplatePreviewClientPage />;
}

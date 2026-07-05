import { Helmet } from 'react-helmet-async'
import type { FaqItem } from '../pages/conversions'

const BASE = 'https://pix-convert-seven.vercel.app'

interface HowToStep {
  name: string
  text: string
  url?: string
}

interface SEOProps {
  title: string
  description: string
  path?: string
  ogImage?: string
  keywords?: string
  faq?: FaqItem[]
  howTo?: { name: string; steps: HowToStep[] }
}

export function SEO({ title, description, path = '', ogImage, keywords, faq, howTo }: SEOProps) {
  const url = `${BASE}${path}`
  const image = ogImage || `${BASE}/og-image.png`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {faq && faq.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })}
        </script>
      )}

      {howTo && howTo.steps.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: howTo.name,
            step: howTo.steps.map((step, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: step.name,
              text: step.text,
              ...(step.url ? { url: step.url } : {}),
            })),
          })}
        </script>
      )}

      {path && path !== '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
              { '@type': 'ListItem', position: 2, name: title.split(' — ')[0], item: url },
            ],
          })}
        </script>
      )}
    </Helmet>
  )
}

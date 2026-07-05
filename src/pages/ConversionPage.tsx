import { SEO } from '../components/SEO'
import { Converter } from '../components/Converter'
import type { ConversionRoute } from './conversions'

interface ConversionPageProps {
  route: ConversionRoute
}

export function ConversionPage({ route }: ConversionPageProps) {
  return (
    <>
      <SEO
        title={route.title}
        description={route.description}
        path={route.path}
        keywords={route.keywords}
      />
      <Converter
        fromHint={route.fromFormat}
        toHint={route.toFormat}
      />
    </>
  )
}

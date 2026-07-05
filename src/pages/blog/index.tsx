import { SEO } from '../../components/SEO'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { ShareButtons } from '../../components/ShareButtons'
import { Link } from 'react-router-dom'
import { blogPosts } from './blog-posts'
import { conversionRoutes } from '../conversions'

const BASE = 'https://pix-convert-seven.vercel.app'

function extractToc(contentHtml: string) {
  const items: { id: string; text: string }[] = []
  const regex = /<h2>([^<]+)<\/h2>/g
  let match
  while ((match = regex.exec(contentHtml)) !== null) {
    const id = match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    items.push({ id, text: match[1] })
  }
  return items
}

function addIdsToHtml(contentHtml: string) {
  return contentHtml.replace(/<h2>([^<]+)<\/h2>/g, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h2 id="${id}">${text}</h2>`
  })
}

export function BlogIndex() {
  const grouped = blogPosts.reduce<Record<string, typeof blogPosts>>((acc, post) => {
    ;(acc[post.category] ||= []).push(post)
    return acc
  }, {})

  return (
    <>
      <SEO
        title="PixConvert Blog — Image Format Guides, Comparisons & Tutorials"
        description="Expert guides on image formats: HEIC vs JPG, WebP vs PNG, AVIF explained, and more. Learn how to optimize images for web, social media, and printing."
        path="/blog"
        keywords="image format blog, HEIC guide, WebP tutorial, image compression tips, format comparison"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'PixConvert Blog',
          description: 'Expert guides on image formats, compression, and conversion.',
          url: `${BASE}/blog`,
          publisher: { '@type': 'Organization', name: 'PixConvert', logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg` } },
          blogPost: blogPosts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.description,
            url: `${BASE}/blog/${p.slug}`,
            datePublished: p.date,
          })),
        })}
      </script>

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">Image Format Blog</h1>
        <p className="conversion-hero__desc">Expert guides, comparisons, and tutorials about image formats, compression, and conversion.</p>
      </section>

      {Object.entries(grouped).map(([category, posts]) => (
        <section key={category} className="content-section">
          <h2>{category}</h2>
          <div className="blog-grid">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card__meta">
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__desc">{post.description}</p>
                <span className="blog-card__readmore">Read more →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

export function BlogArticle({ slug }: { slug: string }) {
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="content-section">
        <h1>Article not found</h1>
        <p>The article you're looking for doesn't exist. <Link to="/blog">View all articles</Link></p>
      </div>
    )
  }

  const url = `${BASE}/blog/${post.slug}`
  const related = blogPosts.filter((p) => post.relatedSlugs.includes(p.slug))
  const toc = extractToc(post.contentHtml)
  const htmlWithIds = addIdsToHtml(post.contentHtml)

  const relatedConversions = conversionRoutes.filter((r) => {
    const a = (r.fromFormat || '').toLowerCase()
    const b = (r.toFormat || '').toLowerCase()
    const needles = new Set([a, b])
    if (a === 'jpeg') needles.add('jpg')
    if (b === 'jpeg') needles.add('jpg')
    for (const n of needles) {
      if (n && post.slug.includes(n)) return true
    }
    return false
  }).slice(0, 4)

  return (
    <>
      <SEO
        title={`${post.title} — PixConvert Blog`}
        description={post.description}
        path={`/blog/${post.slug}`}
        keywords={post.keywords}
      />

      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: post.title },
      ]} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: {
            '@type': 'Organization',
            name: 'PixConvert',
          },
          publisher: {
            '@type': 'Organization',
            name: 'PixConvert',
            logo: {
              '@type': 'ImageObject',
              url: `${BASE}/favicon.svg`,
            },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        })}
      </script>

      <article className="blog-article">
        <header className="blog-article__header">
          <div className="blog-article__meta">
            <span className="blog-article__category">{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="blog-article__title">{post.title}</h1>
          <p className="blog-article__desc">{post.description}</p>
          <ShareButtons url={url} title={post.title} />
        </header>

        {toc.length > 2 && (
          <nav className="blog-toc" aria-label="Table of Contents">
            <strong className="blog-toc__title">Table of Contents</strong>
            <ol className="blog-toc__list">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="blog-toc__link">{item.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className="blog-article__content"
          dangerouslySetInnerHTML={{ __html: htmlWithIds }}
        />
      </article>

      <ShareButtons url={url} title={post.title} />

      {relatedConversions.length > 0 && (
        <section className="content-section related-section">
          <h2>Online Converters</h2>
          <div className="related-grid">
            {relatedConversions.map((r) => (
              <Link key={r.path} to={r.path} className="related-link">
                Convert {r.fromFormat} to {r.toFormat} →
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="content-section related-section">
          <h2>Related Articles</h2>
          <div className="blog-grid">
            {related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-card">
                <div className="blog-card__meta">
                  <span>{r.date}</span>
                  <span>{r.readingTime}</span>
                </div>
                <h3 className="blog-card__title">{r.title}</h3>
                <p className="blog-card__desc">{r.description}</p>
                <span className="blog-card__readmore">Read more →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

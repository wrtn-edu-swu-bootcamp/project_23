import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  },
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const feedUrl = searchParams.get('url')

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Feed URL is required' },
      { status: 400 }
    )
  }

  try {
    const feed = await parser.parseURL(feedUrl)
    
    const items = feed.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      description: item.description,
      source: feed.title,
      enclosure: item.enclosure,
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('RSS Feed Error:', error)
    return NextResponse.json(
      { error: 'Failed to parse RSS feed', items: [] },
      { status: 500 }
    )
  }
}

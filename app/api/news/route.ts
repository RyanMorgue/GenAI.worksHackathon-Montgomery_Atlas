import { NextRequest, NextResponse } from 'next/server';

// Mock news data for Montgomery
const mockNewsArticles = [
  {
    id: 'news_001',
    headline: 'Montgomery Civil Rights District Welcomes 100,000 Annual Visitors',
    summary:
      'The National Memorial for Peace and Justice continues to draw visitors from around the world, strengthening Montgomery\'s position as a destination for historical education and reflection.',
    source: 'Montgomery Advertiser',
    category: 'culture',
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/civil-rights.jpg',
    url: 'https://montgomeryadvertiser.com/story/news/2026/03/04/civil-rights-district',
  },
  {
    id: 'news_002',
    headline: 'New Transit Hub Opens Ahead of Schedule',
    summary:
      'Montgomery\'s new downtown transit hub officially opens, connecting six major bus routes and providing state-of-the-art facilities for commuters.',
    source: 'Montgomery City Report',
    category: 'development',
    publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/transit-hub.jpg',
    url: 'https://montgomeryal.gov/news/transit-hub-opens',
  },
  {
    id: 'news_003',
    headline: 'Local Tech Company Expands with 200 New Jobs',
    summary:
      'Montgomery-based software firm announces major expansion, creating job opportunities in IT, sales, and customer service sectors.',
    source: 'Business Journal',
    category: 'business',
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/tech-expansion.jpg',
    url: 'https://montgomeryadvertiser.com/story/money/2026/03/02/tech-expansion',
  },
  {
    id: 'news_004',
    headline: 'Spring Restoration Project Begins at Riverfront Park',
    summary:
      'City Parks Department starts extensive restoration work on Riverfront Park, including new walking trails and improved accessibility features.',
    source: 'Montgomery Advertiser',
    category: 'recreation',
    publishDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/riverfront-park.jpg',
    url: 'https://montgomeryadvertiser.com/story/news/2026/02/28/riverfront-restoration',
  },
  {
    id: 'news_005',
    headline: 'Public Health Initiative Focuses on Community Wellness',
    summary:
      'Montgomery Health Department launches new community health programs featuring free screenings and fitness initiatives for residents.',
    source: 'Health & Wellness Today',
    category: 'health',
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/health-initiative.jpg',
    url: 'https://montgomeryal.gov/health/wellness-initiative',
  },
  {
    id: 'news_006',
    headline: 'City Council Approves Downtown Revitalization Budget',
    summary:
      'Council votes unanimously to authorize $50 million for downtown infrastructure improvements, economic development, and historic preservation.',
    source: 'Montgomery City Report',
    category: 'government',
    publishDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/downtown-revitalization.jpg',
    url: 'https://montgomeryal.gov/news/revitalization-budget',
  },
  {
    id: 'news_007',
    headline: 'Youth Arts Program Receives National Recognition',
    summary:
      'Montgomery Arts Center\'s youth program recognized nationally for innovative approaches to arts education and community engagement.',
    source: 'Arts Weekly',
    category: 'culture',
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/youth-arts.jpg',
    url: 'https://montgomeryadvertiser.com/story/entertainment/2026/02/22/youth-arts-recognition',
  },
  {
    id: 'news_008',
    headline: 'Crime Prevention Initiative Shows Promise in Early Results',
    summary:
      'Montgomery Police Department reports 15% reduction in property crimes following launch of community policing initiatives.',
    source: 'Safety Today',
    category: 'safety',
    publishDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/images/crime-prevention.jpg',
    url: 'https://montgomeryal.gov/police/crime-prevention-results',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    let articles = [...mockNewsArticles];

    // Filter by category
    if (category) {
      articles = articles.filter((article) => article.category === category);
    }

    // Filter by search term
    if (search) {
      articles = articles.filter(
        (article) =>
          article.headline.toLowerCase().includes(search.toLowerCase()) ||
          article.summary.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Limit results
    articles = articles.slice(0, limit);

    return NextResponse.json({
      status: 'success',
      data: {
        articles,
        categories: [
          'culture',
          'development',
          'business',
          'recreation',
          'health',
          'government',
          'safety',
        ],
        total: mockNewsArticles.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Mock jobs data for Montgomery
const generateMockJobs = (page: number = 1, limit: number = 50) => {
  const jobTitles = [
    'Software Engineer',
    'Data Analyst',
    'Project Manager',
    'UX Designer',
    'DevOps Engineer',
    'Quality Assurance Lead',
    'Business Analyst',
    'Full Stack Developer',
    'Cloud Architect',
    'Security Specialist',
    'Product Manager',
    'Marketing Manager',
  ];

  const companies = [
    'Montgomery Tech Solutions',
    'Southern Data Systems',
    'Capital City Digital',
    'River Valley Innovations',
    'Alabama Enterprises',
    'Civic Tech Montgomery',
    'Innovation Hub AL',
    'Future Forward Inc',
    'Smart City Systems',
    'Tech Catalyst LLC',
  ];

  const locations = [
    'Downtown Montgomery',
    'Eastchase',
    'Riverfront District',
    'North Montgomery',
    'Southgate Business Center',
    'Medical District',
    'Technology Park',
    'Central Business District',
  ];

  const jobs = [];
  const startIndex = (page - 1) * limit;

  for (let i = startIndex; i < startIndex + limit && i < 5000; i++) {
    jobs.push({
      id: `job_${i + 1}`,
      title: jobTitles[i % jobTitles.length],
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      salaryRange: {
        min: 45000 + Math.random() * 100000,
        max: 95000 + Math.random() * 150000,
      },
      type: ['full-time', 'contract', 'part-time'][Math.floor(Math.random() * 3)],
      description: `We're looking for an experienced ${jobTitles[i % jobTitles.length]} to join our team in ${locations[i % locations.length]}.`,
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'].slice(
        0,
        Math.floor(Math.random() * 4) + 1
      ),
      level: ['entry', 'mid', 'senior'][Math.floor(Math.random() * 3)],
    });
  }

  return jobs;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level');
    const type = searchParams.get('type');

    let jobs = generateMockJobs(page, limit);

    // Filter by search term
    if (search) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by level
    if (level) {
      jobs = jobs.filter((job) => job.level === level);
    }

    // Filter by type
    if (type) {
      jobs = jobs.filter((job) => job.type === type);
    }

    const totalJobs = 5000;
    const totalPages = Math.ceil(totalJobs / limit);

    return NextResponse.json({
      status: 'success',
      data: {
        jobs: jobs.slice(0, limit),
        pagination: {
          page,
          limit,
          totalJobs,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Jobs API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

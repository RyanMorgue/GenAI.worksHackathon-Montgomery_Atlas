export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    model: string;
    source: string;
}

export function generateJobs(page: number): Job[] {
    const jobs: Job[] = [];
    const sources = ['LinkedIn', 'Indeed'];
    const models = ['Remote', 'Hybrid', 'Onsite'];
    const titles = ['Software Engineer', 'Data Analyst', 'Marketing Manager', 'Operations Director', 'City Planner', 'Civil Engineer', 'Registered Nurse', 'Financial Advisor'];

    for (let i = 1; i <= 50; i++) {
        const id = (page - 1) * 50 + i;
        jobs.push({
            id: `job-${id}`,
            title: `Senior ${titles[id % titles.length]}`,
            company: id % 3 === 0 ? 'State of Alabama' : (id % 2 === 0 ? 'TechNova Solutions' : 'Montgomery Healthcare'),
            location: 'Montgomery, AL',
            salary: `$${70 + (id % 50)}k - $${100 + (id % 50)}k`,
            model: models[id % 3],
            source: sources[id % 2],
        });
    }
    return jobs;
}

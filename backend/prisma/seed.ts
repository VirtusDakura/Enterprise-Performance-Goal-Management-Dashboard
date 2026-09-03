import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Resetting and seeding database...');

  await prisma.peerReview.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  const departmentsData = [
    { name: 'Engineering' },
    { name: 'Product & Design' },
    { name: 'Sales & Revenue' },
    { name: 'Marketing & Growth' },
    { name: 'Customer Success' },
  ];

  const createdDepartments: Record<string, { id: string; name: string }> = {};

  for (const dept of departmentsData) {
    const record = await prisma.department.create({
      data: dept,
    });
    createdDepartments[dept.name] = record;
  }

  const employeesData = [
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@enterprise.internal',
      role: 'Principal Systems Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Engineering',
    },
    {
      name: 'Marcus Chen',
      email: 'marcus.chen@enterprise.internal',
      role: 'Staff Platform Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Engineering',
    },
    {
      name: 'Amara Okafor',
      email: 'amara.okafor@enterprise.internal',
      role: 'Senior Full-Stack Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Engineering',
    },
    {
      name: 'Sophia Sterling',
      email: 'sophia.sterling@enterprise.internal',
      role: 'Head of Product Management',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Product & Design',
    },
    {
      name: 'Liam Davies',
      email: 'liam.davies@enterprise.internal',
      role: 'Lead UX Designer',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Product & Design',
    },
    {
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@enterprise.internal',
      role: 'VP of Global Enterprise Sales',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Sales & Revenue',
    },
    {
      name: 'Jessica Vance',
      email: 'jessica.vance@enterprise.internal',
      role: 'Senior Strategic Enterprise AE',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Sales & Revenue',
    },
    {
      name: 'Tariq Al-Mansoor',
      email: 'tariq.mansoor@enterprise.internal',
      role: 'Director of Growth Marketing',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Marketing & Growth',
    },
    {
      name: 'Chloe Tremblay',
      email: 'chloe.tremblay@enterprise.internal',
      role: 'Content & Brand Strategist',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Marketing & Growth',
    },
    {
      name: 'David Kim',
      email: 'david.kim@enterprise.internal',
      role: 'Head of Enterprise Customer Success',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Customer Success',
    },
    {
      name: 'Nadia Benali',
      email: 'nadia.benali@enterprise.internal',
      role: 'Senior Technical Account Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      departmentName: 'Customer Success',
    },
  ];

  const createdEmployees: Record<string, { id: string; name: string; departmentId: string }> = {};

  for (const emp of employeesData) {
    const department = createdDepartments[emp.departmentName];
    const record = await prisma.employee.create({
      data: {
        name: emp.name,
        email: emp.email,
        role: emp.role,
        avatarUrl: emp.avatarUrl,
        departmentId: department.id,
      },
    });
    createdEmployees[emp.name] = {
      id: record.id,
      name: record.name,
      departmentId: record.departmentId,
    };
  }

  const now = new Date();
  const futureDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const goalsData = [
    {
      title: 'Architect SOC 2 Type II Security & Compliance Automation',
      description:
        'Implement automated IAM auditing, encryption at rest verification, and zero-trust perimeter network policy enforcing compliance for enterprise SaaS buyers.',
      deadline: futureDays(18),
      progress: 95,
      employeeName: 'Elena Rostova',
      reviews: [
        {
          reviewerName: 'Marcus Chen',
          rating: 5,
          feedback:
            'Outstanding architecture document. The automated verification scripts cut audit prep time by over 70%.',
        },
        {
          reviewerName: 'Sophia Sterling',
          rating: 5,
          feedback:
            'Crucial milestone for closing tier-1 financial enterprise contracts. Flawless execution.',
        },
      ],
    },
    {
      title: 'Zero-Downtime Distributed Cache Migration to Redis Cluster',
      description:
        'Migrate legacy single-node cache layer to resilient 3-region Redis cluster with graceful failover, sub-5ms latency SLAs, and cache-stampede mitigation.',
      deadline: futureDays(30),
      progress: 85,
      employeeName: 'Marcus Chen',
      reviews: [
        {
          reviewerName: 'Elena Rostova',
          rating: 4,
          feedback:
            'Solid failover testing strategy. Latency benchmarks in staging look exceptional under peak stress.',
        },
        {
          reviewerName: 'Amara Okafor',
          rating: 5,
          feedback:
            'The client library adapter was clean and backward-compatible. Smooth deployment.',
        },
      ],
    },
    {
      title: 'Automate Next.js & Microservices CI/CD Pipeline',
      description:
        'Optimize GitHub Actions runners with TurboRepo remote caching, containerized preview deployments, and end-to-end Playwright parallel test matrix.',
      deadline: futureDays(5),
      progress: 100,
      employeeName: 'Amara Okafor',
      reviews: [
        {
          reviewerName: 'Elena Rostova',
          rating: 5,
          feedback:
            'PR build times dropped from 22 minutes to 4 minutes. Major productivity win across squads.',
        },
        {
          reviewerName: 'Marcus Chen',
          rating: 5,
          feedback:
            'The preview deployment bots accelerated QA feedback cycles significantly.',
        },
      ],
    },
    {
      title: 'Real-time WebSocket Push Notification Gateway',
      description:
        'Build unified low-latency event broker supporting multi-device active sessions, presence indicators, and offline message queue buffering.',
      deadline: futureDays(45),
      progress: 80,
      employeeName: 'Amara Okafor',
      reviews: [
        {
          reviewerName: 'Liam Davies',
          rating: 4,
          feedback:
            'Seamless integration with the notification tray. Snappy and responsive.',
        },
      ],
    },
    {
      title: 'Enterprise Design System 2.0 & Token Specification',
      description:
        'Unify core design tokens (spacing, typography, dark/light contrast ratios) into Figma and an accessible React/Tailwind component library.',
      deadline: futureDays(25),
      progress: 90,
      employeeName: 'Liam Davies',
      reviews: [
        {
          reviewerName: 'Amara Okafor',
          rating: 5,
          feedback:
            'The reusable token components streamlined our frontend development velocity.',
        },
        {
          reviewerName: 'Sophia Sterling',
          rating: 4,
          feedback:
            'Polished visual design with strict WCAG AA accessibility compliance out of the box.',
        },
      ],
    },
    {
      title: 'Enterprise Product Strategy & Multi-Tenant Roadmap',
      description:
        'Define 12-month B2B feature vision including granular role-based access control (RBAC), custom reporting, and CRM integrations.',
      deadline: futureDays(12),
      progress: 100,
      employeeName: 'Sophia Sterling',
      reviews: [
        {
          reviewerName: 'Vikram Malhotra',
          rating: 5,
          feedback:
            'This roadmap directly addresses key requirements from enterprise prospect engagements.',
        },
      ],
    },
    {
      title: 'Execute $2.5M Enterprise Software ARR Pipeline Expansion',
      description:
        'Execute account-based expansion targeting enterprise logos in fintech, healthcare, and retail with custom pilot agreements.',
      deadline: futureDays(28),
      progress: 75,
      employeeName: 'Vikram Malhotra',
      reviews: [
        {
          reviewerName: 'David Kim',
          rating: 4,
          feedback:
            'Strong pipeline velocity. Pre-sales alignment with onboarding has been consistent.',
        },
      ],
    },
    {
      title: 'Establish Strategic Cloud Infrastructure Partnerships',
      description:
        'Negotiate marketplace listings, co-sell agreements, and procurement incentives across AWS, Google Cloud, and Azure ecosystems.',
      deadline: futureDays(60),
      progress: 60,
      employeeName: 'Jessica Vance',
      reviews: [
        {
          reviewerName: 'Vikram Malhotra',
          rating: 4,
          feedback:
            'Effective progress on marketplace listing. Key factor in compressing procurement timelines.',
        },
      ],
    },
    {
      title: 'Publish Enterprise Industry Benchmark Study',
      description:
        'Publish comprehensive benchmark study on engineering productivity and distribute via industry technical reports and webinars.',
      deadline: futureDays(20),
      progress: 70,
      employeeName: 'Tariq Al-Mansoor',
      reviews: [
        {
          reviewerName: 'Chloe Tremblay',
          rating: 5,
          feedback:
            'The benchmark data received over 10,000 downloads in the first week. Strong organic reception.',
        },
      ],
    },
    {
      title: 'Produce High-Impact Interactive Customer Case Studies',
      description:
        'Produce structured video and technical case studies with enterprise customers demonstrating ROI, latency reductions, and time-to-value.',
      deadline: futureDays(35),
      progress: 50,
      employeeName: 'Chloe Tremblay',
      reviews: [
        {
          reviewerName: 'Tariq Al-Mansoor',
          rating: 4,
          feedback:
            'Case studies are detailed, measurable, and effective for high-value sales conversations.',
        },
      ],
    },
    {
      title: 'Reduce Time-to-First-Value for New Enterprise Tenants to < 7 Days',
      description:
        'Streamline automated data ingestion, SSO configuration wizards, and white-glove onboarding playbooks for customer admins.',
      deadline: futureDays(15),
      progress: 85,
      employeeName: 'David Kim',
      reviews: [
        {
          reviewerName: 'Nadia Benali',
          rating: 5,
          feedback:
            'Average tenant onboarding dropped from 18 days to 6.2 days with high satisfaction scores.',
        },
      ],
    },
    {
      title: 'Achieve 98% Gross Revenue Retention & Net Promoter Score > 65',
      description:
        'Implement proactive health telemetry, quarterly business reviews (QBRs), and automated risk alert workflows.',
      deadline: futureDays(40),
      progress: 65,
      employeeName: 'Nadia Benali',
      reviews: [
        {
          reviewerName: 'David Kim',
          rating: 5,
          feedback:
            'Proactive customer engagement and responsive technical guidance across key accounts.',
        },
      ],
    },
  ];

  for (const item of goalsData) {
    const employee = createdEmployees[item.employeeName];
    if (!employee) continue;

    const goal = await prisma.goal.create({
      data: {
        title: item.title,
        description: item.description,
        deadline: item.deadline,
        progress: item.progress,
        employeeId: employee.id,
      },
    });

    for (const review of item.reviews) {
      await prisma.peerReview.create({
        data: {
          reviewerName: review.reviewerName,
          rating: review.rating,
          feedback: review.feedback,
          goalId: goal.id,
        },
      });
    }
  }

  console.log(`Database seeded: ${departmentsData.length} departments, ${employeesData.length} employees, ${goalsData.length} goals.`);
}

seed()
  .catch((e) => {
    console.error('Seed execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

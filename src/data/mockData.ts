
// Mock data for all platform features

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  hasTest: boolean;
  testId?: string;
  applications: number;
  postedDate: Date;
  recruiterId: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedDate: Date;
  resumeUrl?: string;
  coverLetter?: string;
  testScore?: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number; // minutes
  passingScore: number;
  createdBy: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'coding' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  skills: string[];
  clientId: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  bids: Bid[];
  createdDate: Date;
}

export interface Bid {
  id: string;
  projectId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  joinDate: Date;
  status: 'active' | 'inactive';
  performance: number;
}

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '₹10L - ₹12.5L',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'Node.js'],
    description: 'We are looking for a senior frontend developer...',
    requirements: ['5+ years experience', 'React expertise', 'TypeScript knowledge'],
    benefits: ['Health insurance', 'Remote work', '401k'],
    hasTest: true,
    testId: '1',
    applications: 24,
    postedDate: new Date('2024-01-15'),
    recruiterId: 'rec1'
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    salary: '₹7.5L - ₹9.2L',
    type: 'Full-time',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    description: 'Creative designer needed for our design team...',
    requirements: ['3+ years experience', 'Portfolio required', 'Figma proficiency'],
    benefits: ['Creative environment', 'Flexible hours', 'Health benefits'],
    hasTest: false,
    applications: 18,
    postedDate: new Date('2024-01-20'),
    recruiterId: 'rec1'
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '₹8.4L - ₹10.9L',
    type: 'Remote',
    skills: ['Python', 'React', 'PostgreSQL'],
    description: 'Join our fast-growing startup as a full stack engineer...',
    requirements: ['4+ years experience', 'Python/React skills', 'Database knowledge'],
    benefits: ['Equity', 'Remote work', 'Learning budget'],
    hasTest: true,
    testId: '2',
    applications: 31,
    postedDate: new Date('2024-01-10'),
    recruiterId: 'rec1'
  }
];

// Mock Tests
export const mockTests: Test[] = [
  {
    id: '1',
    title: 'Frontend Development Assessment',
    description: 'Test your React and JavaScript skills',
    duration: 60,
    passingScore: 70,
    createdBy: 'rec1',
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'What is the virtual DOM in React?',
        options: [
          'A copy of the real DOM',
          'A programming concept where UI is kept in memory',
          'A database structure',
          'A CSS framework'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        id: '2',
        type: 'coding',
        question: 'Write a function that reverses a string',
        points: 20
      }
    ]
  },
  {
    id: '2',
    title: 'Full Stack Assessment',
    description: 'Comprehensive test for full stack developers',
    duration: 90,
    passingScore: 75,
    createdBy: 'rec1',
    questions: [
      {
        id: '3',
        type: 'multiple-choice',
        question: 'Which HTTP method is used to update data?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 2,
        points: 10
      }
    ]
  }
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    userId: 'js1',
    status: 'shortlisted',
    appliedDate: new Date('2024-01-16'),
    testScore: 85
  },
  {
    id: '2',
    jobId: '2',
    userId: 'js1',
    status: 'pending',
    appliedDate: new Date('2024-01-21')
  }
];

// Mock Projects (Freelancer)
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Need a modern e-commerce website with payment integration',
    budget: '₹4.2L - ₹6.7L',
    duration: '2 months',
    skills: ['React', 'Node.js', 'Stripe'],
    clientId: 'client1',
    status: 'open',
    bids: [],
    createdDate: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Mobile App Design',
    description: 'Looking for UI/UX designer for mobile app',
    budget: '₹2.5L - ₹4.2L',
    duration: '1 month',
    skills: ['Figma', 'Mobile Design', 'Prototyping'],
    clientId: 'client2',
    status: 'in-progress',
    bids: [],
    createdDate: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Mobile App Design',
    description: 'Looking for UI/UX designer for mobile app',
    budget: '₹2.5L - ₹4.2L',
    duration: '1 month',
    skills: ['Figma', 'Mobile Design', 'Prototyping'],
    clientId: 'client2',
    status: 'in-progress',
    bids: [],
    createdDate: new Date('2024-01-10')
  }
];

// Mock Employees (HRMS)
export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 95000,
    joinDate: new Date('2023-06-15'),
    status: 'active',
    performance: 4.5
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    position: 'Product Manager',
    department: 'Product',
    salary: 110000,
    joinDate: new Date('2023-03-20'),
    status: 'active',
    performance: 4.2
  }
];

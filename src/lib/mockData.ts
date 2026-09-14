export type Candidate = {
  rollNo: string;
  name: string;
  examName: string;
  examDate: string;
  score: number;
  maxScore: number;
  passed: boolean;
  syllabus: { module: string; topics: string[] }[];
  claimed: boolean;
  feedback?: string;
  dailyProgress: { date: string; tasksCompleted: number; minutesActive: number }[];
  streak: number;
};

// Generate 7 days of dummy progress
const generateProgress = () => {
  const progress = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    progress.push({
      date: d.toISOString().split("T")[0],
      tasksCompleted: Math.floor(Math.random() * 5) + 1,
      minutesActive: Math.floor(Math.random() * 120) + 10,
    });
  }
  return progress;
};

export const MOCK_CANDIDATES: Candidate[] = [
  // 1. Standard Passed Candidate
  {
    rollNo: "1001",
    name: "Alex Johnson",
    examName: "Certified Frontend Developer",
    examDate: "2026-08-15",
    score: 92,
    maxScore: 100,
    passed: true,
    syllabus: [
      {
        module: "Module 1: Foundations",
        topics: ["HTML5 Semantics", "CSS Grid & Flexbox", "Accessibility Basics"],
      },
      {
        module: "Module 2: React Fundamentals",
        topics: ["Hooks", "State Management", "Component Lifecycle"],
      },
      {
        module: "Module 3: Advanced Patterns",
        topics: ["Performance Optimization", "Server Components", "Testing"],
      },
    ],
    claimed: false,
    dailyProgress: generateProgress(),
    streak: 14,
  },
  // 2. Failed Candidate
  {
    rollNo: "1002",
    name: "Sam Taylor",
    examName: "Certified Frontend Developer",
    examDate: "2026-08-15",
    score: 65,
    maxScore: 100,
    passed: false,
    syllabus: [
      {
        module: "Module 1: Foundations",
        topics: ["HTML5 Semantics", "CSS Grid & Flexbox", "Accessibility Basics"],
      },
      {
        module: "Module 2: React Fundamentals",
        topics: ["Hooks", "State Management", "Component Lifecycle"],
      },
      {
        module: "Module 3: Advanced Patterns",
        topics: ["Performance Optimization", "Server Components", "Testing"],
      },
    ],
    claimed: false,
    dailyProgress: generateProgress(),
    streak: 3,
  },
  // 3. Already Claimed
  {
    rollNo: "1003",
    name: "Jordan Lee",
    examName: "Certified Frontend Developer",
    examDate: "2026-08-15",
    score: 88,
    maxScore: 100,
    passed: true,
    syllabus: [
      {
        module: "Module 1: Foundations",
        topics: ["HTML5 Semantics", "CSS Grid & Flexbox", "Accessibility Basics"],
      },
      {
        module: "Module 2: React Fundamentals",
        topics: ["Hooks", "State Management", "Component Lifecycle"],
      },
      {
        module: "Module 3: Advanced Patterns",
        topics: ["Performance Optimization", "Server Components", "Testing"],
      },
    ],
    claimed: true,
    feedback: "The exam was fair and well-structured.",
    dailyProgress: generateProgress(),
    streak: 21,
  },
  // 4. Long Name
  {
    rollNo: "1004",
    name: "Isabella Maria Constanza de la Cruz Fernandez",
    examName: "Certified Frontend Developer",
    examDate: "2026-08-15",
    score: 95,
    maxScore: 100,
    passed: true,
    syllabus: [
      {
        module: "Module 1: Foundations",
        topics: ["HTML5 Semantics", "CSS Grid & Flexbox", "Accessibility Basics"],
      },
      {
        module: "Module 2: React Fundamentals",
        topics: ["Hooks", "State Management", "Component Lifecycle"],
      },
      {
        module: "Module 3: Advanced Patterns",
        topics: ["Performance Optimization", "Server Components", "Testing"],
      },
    ],
    claimed: false,
    dailyProgress: generateProgress(),
    streak: 42,
  },
  // 5. Sparse Data
  {
    rollNo: "1005",
    name: "Casey Smith",
    examName: "Certified Frontend Developer",
    examDate: "2026-08-15",
    score: 75,
    maxScore: 100,
    passed: true,
    syllabus: [], // Missing syllabus data to test empty state
    claimed: false,
    dailyProgress: generateProgress(),
    streak: 0,
  },
];

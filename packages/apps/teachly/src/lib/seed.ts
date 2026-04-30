import type {
  TeachlyClass,
  TeachlyActivity,
  ActivitySubmission,
  CommunityPost,
  TeachlyStudent,
} from '@ecosystem/types';

export const SEED_CLASSES: TeachlyClass[] = [
  {
    id: 'cls-1',
    name: 'Science Explorers',
    emoji: '🔭',
    teacherId: 'teacher-sarah',
    color: 'sky',
    schedule: { days: ['wed', 'fri'], time: '16:00', durationMinutes: 45 },
    studentIds: ['stu-mia', 'stu-leo', 'stu-zoe', 'stu-alex', 'stu-ben', 'stu-cara', 'stu-dan'],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-04-28'),
  },
  {
    id: 'cls-2',
    name: 'Story & Reading',
    emoji: '📖',
    teacherId: 'teacher-sarah',
    color: 'leaf',
    schedule: { days: ['mon'], time: '15:00', durationMinutes: 30 },
    studentIds: ['stu-mia', 'stu-anna', 'stu-beth', 'stu-cara', 'stu-dan', 'stu-eli'],
    createdAt: new Date('2025-02-03'),
    updatedAt: new Date('2025-04-28'),
  },
  {
    id: 'cls-3',
    name: 'Art & Creativity',
    emoji: '🎨',
    teacherId: 'teacher-sarah',
    color: 'sun',
    schedule: { days: ['sat'], time: '10:00', durationMinutes: 60 },
    studentIds: ['stu-cara', 'stu-dan', 'stu-eli', 'stu-finn', 'stu-grace'],
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-04-28'),
  },
];

export const SEED_ACTIVITIES: TeachlyActivity[] = [
  {
    id: 'act-1',
    classId: 'cls-1',
    title: 'Draw your favourite planet',
    description: 'Use any medium — pencil, paint, or digital — to draw and label your favourite planet.',
    type: 'drawing',
    dueDate: new Date('2025-04-30'),
    createdAt: new Date('2025-04-25'),
  },
  {
    id: 'act-2',
    classId: 'cls-1',
    title: 'Record: "What is the Sun?"',
    description: 'Record a short voice note explaining what the Sun is in your own words.',
    type: 'voice',
    dueDate: new Date('2025-04-28'),
    createdAt: new Date('2025-04-22'),
  },
  {
    id: 'act-3',
    classId: 'cls-2',
    title: 'Read Ch. 3 of "Magic Treehouse"',
    description: 'Read chapter 3 and write two sentences about your favourite part.',
    type: 'reading',
    dueDate: new Date('2025-05-02'),
    createdAt: new Date('2025-04-27'),
  },
  {
    id: 'act-4',
    classId: 'cls-1',
    title: 'Counting Stars Worksheet',
    description: 'Complete the counting stars maths worksheet.',
    type: 'worksheet',
    createdAt: new Date('2025-04-29'),
  },
];

export const SEED_SUBMISSIONS: ActivitySubmission[] = [
  {
    id: 'sub-1',
    activityId: 'act-2',
    studentId: 'stu-mia',
    status: 'submitted',
    submittedAt: new Date('2025-04-28T14:30:00'),
    content: 'The Sun is a star at the centre of our Solar System.',
  },
  {
    id: 'sub-2',
    activityId: 'act-1',
    studentId: 'stu-mia',
    status: 'pending',
  },
];

export const SEED_COMMUNITY: CommunityPost[] = [
  {
    id: 'post-1',
    classId: 'cls-1',
    authorId: 'teacher-sarah',
    authorName: 'Ms. Sarah',
    authorRole: 'teacher',
    content:
      "Great session today everyone! 🌟 Mia's explanation of gravity was SO impressive. Don't forget the planet drawing activity — due this Friday!",
    reactions: [
      { emoji: '❤️', count: 6 },
      { emoji: '🌟', count: 4 },
    ],
    createdAt: new Date('2025-04-30T12:00:00'),
  },
  {
    id: 'post-2',
    classId: 'cls-1',
    authorId: 'parent-leo',
    authorName: "Leo's Mom",
    authorRole: 'parent',
    content:
      "Leo wouldn't stop talking about black holes after class 😂 Thank you Ms. Sarah! We're doing the drawing together tonight.",
    reactions: [
      { emoji: '😂', count: 8 },
      { emoji: '❤️', count: 5 },
    ],
    createdAt: new Date('2025-04-30T13:00:00'),
  },
  {
    id: 'post-3',
    classId: 'cls-1',
    authorId: 'parent-zoe',
    authorName: "Zoe's Dad",
    authorRole: 'parent',
    content:
      'Zoe just submitted her voice recording! She was so proud 🥹 This is exactly what we were looking for in remote learning.',
    reactions: [
      { emoji: '🥹', count: 7 },
      { emoji: '❤️', count: 9 },
    ],
    createdAt: new Date('2025-04-30T13:30:00'),
  },
];

export const SEED_STUDENTS: TeachlyStudent[] = [
  {
    id: 'stu-mia',
    name: 'Mia',
    age: 7,
    parentId: 'parent-jamie',
    classIds: ['cls-1', 'cls-2'],
    stars: 24,
    badges: ['Star Student', 'Art Explorer', 'Bookworm'],
  },
  {
    id: 'stu-leo',
    name: 'Leo',
    age: 8,
    parentId: 'parent-leo',
    classIds: ['cls-1'],
    stars: 18,
    badges: ['Star Student'],
  },
  {
    id: 'stu-zoe',
    name: 'Zoe',
    age: 7,
    parentId: 'parent-zoe',
    classIds: ['cls-1'],
    stars: 20,
    badges: ['Star Student', 'Bookworm'],
  },
];

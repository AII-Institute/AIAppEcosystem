import type { MCPCapability } from '@ecosystem/types';
import { TEACHLY_APP_ID } from '@ecosystem/shared';

export const teachlyCapability: MCPCapability = {
  name: TEACHLY_APP_ID,
  description: 'Teachly — live remote classes, async activities, and parent community for K-12',
  version: '1.0.0',
  tools: [
    {
      name: 'teachly.listClasses',
      description: 'List all classes for the authenticated teacher or parent',
      requiresAuth: true,
      requiredScopes: ['teachly:classes:read' as never],
      inputSchema: {
        type: 'object',
        properties: {
          role: { type: 'string', enum: ['teacher', 'parent'], description: 'Caller role' },
        },
        required: ['role'],
      },
    },
    {
      name: 'teachly.createClass',
      description: 'Create a new class (teacher only)',
      requiresAuth: true,
      requiredScopes: ['teachly:classes:write' as never],
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          emoji: { type: 'string' },
          color: { type: 'string', enum: ['sky', 'leaf', 'sun', 'coral'] },
          scheduleDays: { type: 'array', items: { type: 'string' } },
          scheduleTime: { type: 'string' },
          durationMinutes: { type: 'number' },
        },
        required: ['name', 'emoji', 'color', 'scheduleDays', 'scheduleTime', 'durationMinutes'],
      },
    },
    {
      name: 'teachly.listActivities',
      description: 'List activities for a class, optionally filtered by student',
      requiresAuth: true,
      requiredScopes: ['teachly:activities:read' as never],
      inputSchema: {
        type: 'object',
        properties: {
          classId: { type: 'string' },
          studentId: { type: 'string', description: 'Filter by student (parent view)' },
        },
        required: ['classId'],
      },
    },
    {
      name: 'teachly.submitActivity',
      description: 'Submit an activity completion (student/parent)',
      requiresAuth: true,
      requiredScopes: ['teachly:activities:write' as never],
      inputSchema: {
        type: 'object',
        properties: {
          activityId: { type: 'string' },
          studentId: { type: 'string' },
          content: { type: 'string', description: 'Submission content or media URL' },
        },
        required: ['activityId', 'studentId'],
      },
    },
    {
      name: 'teachly.listCommunityPosts',
      description: 'List community posts for a class',
      requiresAuth: true,
      requiredScopes: ['teachly:community:read' as never],
      inputSchema: {
        type: 'object',
        properties: {
          classId: { type: 'string' },
          limit: { type: 'number', description: 'Max posts to return (default 20)' },
        },
        required: ['classId'],
      },
    },
    {
      name: 'teachly.createCommunityPost',
      description: 'Post a message to the class community board',
      requiresAuth: true,
      requiredScopes: ['teachly:community:write' as never],
      inputSchema: {
        type: 'object',
        properties: {
          classId: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['classId', 'content'],
      },
    },
    {
      name: 'teachly.getStudentProgress',
      description: 'Get attendance, activity completion and stars for a student',
      requiresAuth: true,
      requiredScopes: ['teachly:students:read' as never],
      inputSchema: {
        type: 'object',
        properties: {
          studentId: { type: 'string' },
        },
        required: ['studentId'],
      },
    },
  ],
  resources: [
    {
      uri: 'teachly://classes',
      name: 'Teachly Classes',
      description: 'All classes managed by the teacher',
      mimeType: 'application/json',
    },
    {
      uri: 'teachly://activities',
      name: 'Teachly Activities',
      description: 'Async activities assigned across all classes',
      mimeType: 'application/json',
    },
    {
      uri: 'teachly://community',
      name: 'Teachly Community Board',
      description: 'Per-class community posts from teachers and parents',
      mimeType: 'application/json',
    },
  ],
};

export type ProfileInput = {
  name: string;
  targetRole: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  interests: string;
  weeklyHours: number;
  strengths: string;
  weakAreas: string;
  tools: string;
};

export type PlanOutput = {
  summary: string;
  topSkills: string[];
  roadmap: { phase: string; actions: string[] }[];
  projects: { title: string; impact: string; stack: string }[];
  interviewQuestions: string[];
  resumeChecklist: string[];
  weeklyPlan: { week: string; goals: string[] }[];
  skillGap: { missingSkill: string; whyItMatters: string; firstAction: string }[];
};

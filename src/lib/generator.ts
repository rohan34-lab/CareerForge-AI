import { PlanOutput, ProfileInput } from './types';

const fallback = (profile: ProfileInput): PlanOutput => ({
  summary: `${profile.name || 'Student'} is targeting ${profile.targetRole}. Focus on consistent weekly execution and portfolio-based learning.`,
  topSkills: ['Role fundamentals', 'Portfolio storytelling', 'Interview communication', 'Tool fluency', 'Problem-solving reps'],
  roadmap: [
    { phase: 'Month 1: Foundation', actions: ['Close top 2 skill gaps', 'Build mini project #1', 'Update resume bullets'] },
    { phase: 'Month 2: Portfolio', actions: ['Ship flagship project', 'Publish project write-up', 'Get 2 peer reviews'] },
    { phase: 'Month 3: Hiring Prep', actions: ['Mock interviews weekly', 'Targeted applications', 'Networking outreach'] }
  ],
  projects: [
    { title: `${profile.targetRole} Portfolio Project`, impact: 'Demonstrates end-to-end ability with measurable outcomes.', stack: profile.tools || 'Role-relevant stack' },
    { title: 'Data + Insights Case Study', impact: 'Shows analysis, communication, and business impact.', stack: 'Python/SQL + dashboard' }
  ],
  interviewQuestions: [
    'Walk me through a project where you handled ambiguity.',
    'How do you prioritize when time is limited?',
    'What is one weakness you are actively improving and how?'
  ],
  resumeChecklist: [
    'Use quantified bullets (impact, scale, speed).',
    'Tailor summary and skills section to target role.',
    'Add links to portfolio projects and GitHub.',
    'Keep to one page, high signal only.'
  ],
  weeklyPlan: [
    { week: 'Week 1', goals: ['2 hours learning', '3 hours building', '1 hour reflection'] },
    { week: 'Week 2', goals: ['Ship milestone', 'Update resume bullet', 'Mock interview x1'] }
  ],
  skillGap: [
    { missingSkill: profile.weakAreas || 'Role-specific depth', whyItMatters: 'Recruiters screen for this in projects and interviews.', firstAction: 'Schedule 3 focused practice sessions this week.' }
  ]
});

const asStringArray = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []);

const sanitizePlan = (raw: unknown, profile: ProfileInput): PlanOutput => {
  const base = fallback(profile);
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  const roadmap = Array.isArray(obj.roadmap)
    ? obj.roadmap
        .map((item) => {
          const row = item as Record<string, unknown>;
          return {
            phase: typeof row?.phase === 'string' ? row.phase : '',
            actions: asStringArray(row?.actions)
          };
        })
        .filter((item) => item.phase && item.actions.length > 0)
    : [];

  const projects = Array.isArray(obj.projects)
    ? obj.projects
        .map((item) => {
          const row = item as Record<string, unknown>;
          return {
            title: typeof row?.title === 'string' ? row.title : '',
            impact: typeof row?.impact === 'string' ? row.impact : '',
            stack: typeof row?.stack === 'string' ? row.stack : ''
          };
        })
        .filter((item) => item.title && item.impact && item.stack)
    : [];

  const weeklyPlan = Array.isArray(obj.weeklyPlan)
    ? obj.weeklyPlan
        .map((item) => {
          const row = item as Record<string, unknown>;
          return {
            week: typeof row?.week === 'string' ? row.week : '',
            goals: asStringArray(row?.goals)
          };
        })
        .filter((item) => item.week && item.goals.length > 0)
    : [];

  const skillGap = Array.isArray(obj.skillGap)
    ? obj.skillGap
        .map((item) => {
          const row = item as Record<string, unknown>;
          return {
            missingSkill: typeof row?.missingSkill === 'string' ? row.missingSkill : '',
            whyItMatters: typeof row?.whyItMatters === 'string' ? row.whyItMatters : '',
            firstAction: typeof row?.firstAction === 'string' ? row.firstAction : ''
          };
        })
        .filter((item) => item.missingSkill && item.whyItMatters && item.firstAction)
    : [];

  return {
    summary: typeof obj.summary === 'string' && obj.summary.trim() ? obj.summary : base.summary,
    topSkills: asStringArray(obj.topSkills).length > 0 ? asStringArray(obj.topSkills) : base.topSkills,
    roadmap: roadmap.length > 0 ? roadmap : base.roadmap,
    projects: projects.length > 0 ? projects : base.projects,
    interviewQuestions: asStringArray(obj.interviewQuestions).length > 0 ? asStringArray(obj.interviewQuestions) : base.interviewQuestions,
    resumeChecklist: asStringArray(obj.resumeChecklist).length > 0 ? asStringArray(obj.resumeChecklist) : base.resumeChecklist,
    weeklyPlan: weeklyPlan.length > 0 ? weeklyPlan : base.weeklyPlan,
    skillGap: skillGap.length > 0 ? skillGap : base.skillGap
  };
};

export async function generatePlan(profile: ProfileInput): Promise<PlanOutput> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) return fallback(profile);

  try {
    const prompt = `Generate concise JSON for a student career plan with keys: summary, topSkills, roadmap, projects, interviewQuestions, resumeChecklist, weeklyPlan, skillGap. Input: ${JSON.stringify(profile)}`;
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) return fallback(profile);
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== 'string') return fallback(profile);

    const parsed = JSON.parse(content);
    return sanitizePlan(parsed, profile);
  } catch {
    return fallback(profile);
  }
}

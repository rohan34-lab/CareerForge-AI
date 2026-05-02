'use client';

import { useEffect, useState } from 'react';
import demoProfiles from '@/../data/demoProfiles.json';
import { PlanOutput, ProfileInput } from '@/lib/types';

const initialProfile: ProfileInput = {
  name: '',
  targetRole: 'Software Engineer',
  skillLevel: 'Beginner',
  interests: '',
  weeklyHours: 6,
  strengths: '',
  weakAreas: '',
  tools: ''
};

const STORAGE_KEY = 'careerforge-state-v1';

type PersistedState = {
  profile: ProfileInput;
  plan: PlanOutput | null;
  progress: number;
};

export default function Home() {
  const [profile, setProfile] = useState<ProfileInput>(initialProfile);
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.profile) setProfile(parsed.profile);
      if (typeof parsed.progress === 'number') setProgress(parsed.progress);
      setPlan(parsed.plan ?? null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const state: PersistedState = { profile, plan, progress };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [profile, plan, progress]);

  const generate = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await res.json();

      if (!res.ok) {
        const issueText = Array.isArray(data?.issues)
          ? ` (${data.issues.map((i: { path?: string; message?: string }) => `${i.path ?? 'field'}: ${i.message ?? 'invalid value'}`).join(', ')})`
          : '';

        setPlan(null);
        setError(`${data?.error ?? 'Failed to generate plan.'}${issueText}`);
        return;
      }

      if (!data?.plan) {
        setPlan(null);
        setError('API returned an unexpected response.');
        return;
      }

      setPlan(data.plan);
    } catch {
      setPlan(null);
      setError('Network error while generating plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <section className="rounded-2xl bg-gradient-to-r from-brand to-accent p-8 text-white">
        <h1 className="text-4xl font-bold">CareerForge AI</h1>
        <p className="mt-2 text-lg">Your student career-prep copilot: roadmap, projects, resume, interview prep, and weekly execution.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl bg-white p-5 shadow">
          <h2 className="text-xl font-semibold">Onboarding</h2>

          <label className="block space-y-1"><span className="text-sm font-medium">Name</span><input className="w-full rounded border p-2" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">Target Role</span><input className="w-full rounded border p-2" value={profile.targetRole} onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">Skill Level</span><select className="w-full rounded border p-2" value={profile.skillLevel} onChange={(e) => setProfile((p) => ({ ...p, skillLevel: e.target.value as ProfileInput['skillLevel'] }))}><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></label>

          <label className="block space-y-1"><span className="text-sm font-medium">Weekly Hours (1-40)</span><input type="number" min={1} max={40} className="w-full rounded border p-2" value={profile.weeklyHours} onChange={(e) => setProfile((p) => ({ ...p, weeklyHours: Number(e.target.value) || 1 }))} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">Interests</span><textarea className="w-full rounded border p-2" rows={2} value={profile.interests} onChange={(e) => setProfile((p) => ({ ...p, interests: e.target.value }))} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">Strengths</span><textarea className="w-full rounded border p-2" rows={2} value={profile.strengths} onChange={(e) => setProfile((p) => ({ ...p, strengths: e.target.value }))} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">Weak Areas</span><textarea className="w-full rounded border p-2" rows={2} value={profile.weakAreas} onChange={(e) => setProfile((p) => ({ ...p, weakAreas: e.target.value }))} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">Tools / Stack</span><input className="w-full rounded border p-2" value={profile.tools} onChange={(e) => setProfile((p) => ({ ...p, tools: e.target.value }))} /></label>

          <div className="flex gap-3">
            <button onClick={generate} className="rounded bg-brand px-4 py-2 text-white" disabled={loading}>{loading ? 'Generating...' : 'Generate Plan'}</button>
            <button onClick={() => setProfile(demoProfiles[0] as ProfileInput)} className="rounded border px-4 py-2" disabled={loading}>Load Demo</button>
          </div>

          {error ? <p className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="space-y-3 rounded-xl bg-white p-5 shadow">
          <h2 className="text-xl font-semibold">Progress Tracker</h2>
          <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full" />
          <p>{progress}% complete this week</p>
          <p className="text-sm text-slate-600">Tip: move this slider during demo to show iterative progress tracking.</p>
        </div>
      </section>

      {!plan && !loading && <section className="rounded-xl border border-dashed p-6 text-center text-slate-500">No plan yet. Fill onboarding and generate.</section>}
      {plan && <section className="grid gap-6 md:grid-cols-2"><Card title="Summary" content={<p>{plan.summary}</p>} /><Card title="Top Skills" content={<ul className="list-disc pl-6">{plan.topSkills.map((s) => <li key={s}>{s}</li>)}</ul>} /><Card title="Roadmap" content={<ul className="space-y-2">{plan.roadmap.map((r) => <li key={r.phase}><b>{r.phase}</b>: {r.actions.join(' • ')}</li>)}</ul>} /><Card title="Portfolio Projects" content={<ul className="space-y-2">{plan.projects.map((p) => <li key={p.title}><b>{p.title}</b> — {p.impact} ({p.stack})</li>)}</ul>} /><Card title="Interview Prep" content={<ul className="list-disc pl-6">{plan.interviewQuestions.map((q) => <li key={q}>{q}</li>)}</ul>} /><Card title="Resume Checklist" content={<ul className="list-disc pl-6">{plan.resumeChecklist.map((r) => <li key={r}>{r}</li>)}</ul>} /><Card title="Weekly Plan" content={<ul>{plan.weeklyPlan.map((w) => <li key={w.week}><b>{w.week}</b>: {w.goals.join(', ')}</li>)}</ul>} /><Card title="Skill Gap Analysis" content={<ul>{plan.skillGap.map((s) => <li key={s.missingSkill}><b>{s.missingSkill}</b>: {s.firstAction}</li>)}</ul>} /></section>}
    </main>
  );
}

function Card({ title, content }: { title: string; content: React.ReactNode }) {
  return <div className="rounded-xl bg-white p-5 shadow"><h3 className="mb-2 text-lg font-semibold">{title}</h3>{content}</div>;
}

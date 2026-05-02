'use client';

import { useState } from 'react';
import demoProfiles from '@/../data/demoProfiles.json';
import { PlanOutput, ProfileInput } from '@/lib/types';

const initialProfile: ProfileInput = {
  name: '', targetRole: 'Software Engineer', skillLevel: 'Beginner', interests: '', weeklyHours: 6, strengths: '', weakAreas: '', tools: ''
};

export default function Home() {
  const [profile, setProfile] = useState<ProfileInput>(initialProfile);
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', { method: 'POST', body: JSON.stringify(profile) });
    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-brand to-accent p-8 text-white">
        <h1 className="text-4xl font-bold">CareerForge AI</h1>
        <p className="mt-2 text-lg">Your student career-prep copilot: roadmap, projects, resume, interview prep, and weekly execution.</p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-5 shadow space-y-3">
          <h2 className="text-xl font-semibold">Onboarding</h2>
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium capitalize">{key}</label>
              <input
                className="w-full rounded border p-2"
                value={value as string | number}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: key === 'weeklyHours' ? Number(e.target.value) : e.target.value }))}
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={generate} className="rounded bg-brand px-4 py-2 text-white">{loading ? 'Generating...' : 'Generate Plan'}</button>
            <button onClick={() => setProfile(demoProfiles[0] as ProfileInput)} className="rounded border px-4 py-2">Load Demo</button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow space-y-3">
          <h2 className="text-xl font-semibold">Progress Tracker</h2>
          <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full" />
          <p>{progress}% complete this week</p>
          <p className="text-sm text-slate-600">Tip: move this slider during demo to show iterative progress tracking.</p>
        </div>
      </section>

      {!plan && !loading && <section className="rounded-xl border border-dashed p-6 text-center text-slate-500">No plan yet. Fill onboarding and generate.</section>}

      {plan && (
        <section className="grid md:grid-cols-2 gap-6">
          <Card title="Summary" content={<p>{plan.summary}</p>} />
          <Card title="Top Skills" content={<ul className="list-disc pl-6">{plan.topSkills.map((s) => <li key={s}>{s}</li>)}</ul>} />
          <Card title="Roadmap" content={<ul className="space-y-2">{plan.roadmap.map((r) => <li key={r.phase}><b>{r.phase}</b>: {r.actions.join(' • ')}</li>)}</ul>} />
          <Card title="Portfolio Projects" content={<ul className="space-y-2">{plan.projects.map((p) => <li key={p.title}><b>{p.title}</b> — {p.impact} ({p.stack})</li>)}</ul>} />
          <Card title="Interview Prep" content={<ul className="list-disc pl-6">{plan.interviewQuestions.map((q) => <li key={q}>{q}</li>)}</ul>} />
          <Card title="Resume Checklist" content={<ul className="list-disc pl-6">{plan.resumeChecklist.map((r) => <li key={r}>{r}</li>)}</ul>} />
          <Card title="Weekly Plan" content={<ul>{plan.weeklyPlan.map((w) => <li key={w.week}><b>{w.week}</b>: {w.goals.join(', ')}</li>)}</ul>} />
          <Card title="Skill Gap Analysis" content={<ul>{plan.skillGap.map((s) => <li key={s.missingSkill}><b>{s.missingSkill}</b>: {s.firstAction}</li>)}</ul>} />
        </section>
      )}
    </main>
  );
}

function Card({ title, content }: { title: string; content: React.ReactNode }) {
  return <div className="rounded-xl bg-white p-5 shadow"><h3 className="mb-2 text-lg font-semibold">{title}</h3>{content}</div>;
}

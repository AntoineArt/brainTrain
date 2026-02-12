'use client';

import type { CognitiveSkill } from '@/types';
import { SKILL_LABELS, SKILL_COLORS } from '@/lib/constants';

interface SkillRadarProps {
  scores: Record<CognitiveSkill, number>; // 0-100
}

const SKILLS: CognitiveSkill[] = ['calcul', 'memoire', 'logique', 'vitesse', 'langage', 'attention'];
const CENTER = 100;
const RADIUS = 80;
const LABEL_RADIUS = 95;

function polarToCartesian(angle: number, radius: number): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

export function SkillRadar({ scores }: SkillRadarProps) {
  const angleStep = 360 / SKILLS.length;

  const rings = [0.25, 0.5, 0.75, 1].map((factor) => {
    const r = RADIUS * factor;
    const points = SKILLS.map((_, i) => {
      const { x, y } = polarToCartesian(i * angleStep, r);
      return `${x},${y}`;
    }).join(' ');
    return <polygon key={factor} points={points} fill="none" stroke="var(--border)" strokeWidth="0.5" opacity={0.4} />;
  });

  const axes = SKILLS.map((_, i) => {
    const { x, y } = polarToCartesian(i * angleStep, RADIUS);
    return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--border)" strokeWidth="0.5" opacity={0.4} />;
  });

  const dataPoints = SKILLS.map((skill, i) => {
    const value = Math.min(100, Math.max(0, scores[skill] || 0));
    const r = (value / 100) * RADIUS;
    const { x, y } = polarToCartesian(i * angleStep, r);
    return `${x},${y}`;
  }).join(' ');

  const labels = SKILLS.map((skill, i) => {
    const { x, y } = polarToCartesian(i * angleStep, LABEL_RADIUS);
    return (
      <text
        key={skill}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[8px] font-semibold uppercase tracking-wider"
        fill={SKILL_COLORS[skill]}
      >
        {SKILL_LABELS[skill]}
      </text>
    );
  });

  const dots = SKILLS.map((skill, i) => {
    const value = Math.min(100, Math.max(0, scores[skill] || 0));
    const r = (value / 100) * RADIUS;
    const { x, y } = polarToCartesian(i * angleStep, r);
    return (
      <circle
        key={skill}
        cx={x}
        cy={y}
        r={3}
        fill={SKILL_COLORS[skill]}
      />
    );
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {rings}
      {axes}
      <polygon
        points={dataPoints}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
      {dots}
      {labels}
    </svg>
  );
}

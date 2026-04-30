'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

type Role = 'teacher' | 'parent' | 'student';
type Step = 'welcome' | 'profile' | 'role_setup' | 'done';

const STEPS: Step[] = ['welcome', 'profile', 'role_setup', 'done'];

const AVATAR_COLORS = [
  { label: 'Sky', value: '#4ABDE8' },
  { label: 'Leaf', value: '#3EBD7A' },
  { label: 'Sun', value: '#FFB830' },
  { label: 'Coral', value: '#FF6B6B' },
  { label: 'Ink', value: '#2D2D2D' },
];

const ROLE_SETUP: Record<Role, { title: string; placeholder: string; fieldKey: string }> = {
  teacher: {
    title: 'Name your first class',
    placeholder: 'e.g. Science Explorers',
    fieldKey: 'className',
  },
  parent: {
    title: "Enter your child's class code",
    placeholder: 'e.g. SC-2024',
    fieldKey: 'classCode',
  },
  student: { title: 'Enter your class code', placeholder: 'e.g. SC-2024', fieldKey: 'classCode' },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].value);
  const [roleField, setRoleField] = useState('');

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  async function advanceTo(next: Step, extraData?: Record<string, string>) {
    setLoading(true);
    setError(null);
    try {
      if (step === 'welcome') {
        const res = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch('/api/onboarding', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            currentStep: next,
            status: next === 'done' ? 'completed' : 'in_progress',
            stepData: extraData ?? {},
            completedAt: next === 'done' ? new Date().toISOString() : null,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      }
      setStep(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--paper-warm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 480, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            ✦ Teachly
          </span>
          {step !== 'done' && (
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600 }}>
              Step {stepIndex + 1} of {STEPS.length}
            </span>
          )}
        </div>
        <div style={{ height: 4, background: '#E8E4DE', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--sky)',
              borderRadius: 99,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 40,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {error && (
          <div
            style={{
              background: '#FEE2E2',
              color: '#991B1B',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {step === 'welcome' && (
          <WelcomeStep
            email={email}
            role={role}
            onEmailChange={setEmail}
            onRoleChange={setRole}
            onNext={() => role && email && advanceTo('profile')}
            loading={loading}
          />
        )}
        {step === 'profile' && (
          <ProfileStep
            displayName={displayName}
            avatarColor={avatarColor}
            onNameChange={setDisplayName}
            onColorChange={setAvatarColor}
            onNext={() => displayName && advanceTo('role_setup', { displayName, avatarColor })}
            loading={loading}
          />
        )}
        {step === 'role_setup' && role && (
          <RoleSetupStep
            role={role}
            value={roleField}
            onChange={setRoleField}
            onNext={() =>
              roleField && advanceTo('done', { [ROLE_SETUP[role].fieldKey]: roleField })
            }
            loading={loading}
          />
        )}
        {step === 'done' && role && (
          <DoneStep displayName={displayName} role={role} onGo={() => router.push('/dashboard')} />
        )}
      </div>
    </div>
  );
}

// ── Sub-steps ─────────────────────────────────────────────────

function WelcomeStep({
  email,
  role,
  onEmailChange,
  onRoleChange,
  onNext,
  loading,
}: {
  email: string;
  role: Role | null;
  onEmailChange: (v: string) => void;
  onRoleChange: (v: Role) => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <>
      <h1 style={heading}>Welcome to Teachly 👋</h1>
      <p style={sub}>Let&apos;s get you set up. First, tell us who you are.</p>
      <label style={labelStyle}>Email address</label>
      <input
        style={input}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <label style={{ ...labelStyle, marginTop: 20 }}>I am a…</label>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {(['teacher', 'parent', 'student'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => onRoleChange(r)}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 10,
              border: `2px solid ${role === r ? 'var(--sky)' : '#E0DDD8'}`,
              background: role === r ? 'var(--sky-light, #EAF6FC)' : 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--ink)',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
          >
            {r}
          </button>
        ))}
      </div>
      <Button
        variant="sky"
        size="md"
        onClick={onNext}
        disabled={!email || !role || loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Saving…' : 'Continue →'}
      </Button>
    </>
  );
}

function ProfileStep({
  displayName,
  avatarColor,
  onNameChange,
  onColorChange,
  onNext,
  loading,
}: {
  displayName: string;
  avatarColor: string;
  onNameChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {displayName ? displayName[0].toUpperCase() : '?'}
        </div>
      </div>
      <h1 style={heading}>Set up your profile</h1>
      <label style={labelStyle}>Your name</label>
      <input
        style={input}
        type="text"
        placeholder="e.g. Sarah"
        value={displayName}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <label style={{ ...labelStyle, marginTop: 20 }}>Avatar colour</label>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {AVATAR_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            title={c.label}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: c.value,
              border: `3px solid ${avatarColor === c.value ? 'var(--ink)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'border 0.15s',
            }}
          />
        ))}
      </div>
      <Button
        variant="sky"
        size="md"
        onClick={onNext}
        disabled={!displayName || loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Saving…' : 'Continue →'}
      </Button>
    </>
  );
}

function RoleSetupStep({
  role,
  value,
  onChange,
  onNext,
  loading,
}: {
  role: Role;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  loading: boolean;
}) {
  const cfg = ROLE_SETUP[role];
  return (
    <>
      <h1 style={heading}>{cfg.title}</h1>
      <p style={sub}>You can always update this later from your settings.</p>
      <label style={labelStyle}>{role === 'teacher' ? 'Class name' : 'Class code'}</label>
      <input
        style={input}
        type="text"
        placeholder={cfg.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
        <Button
          variant="sky"
          size="md"
          onClick={onNext}
          disabled={!value || loading}
          style={{ flex: 1 }}
        >
          {loading ? 'Saving…' : 'Finish setup →'}
        </Button>
      </div>
    </>
  );
}

function DoneStep({
  displayName,
  role,
  onGo,
}: {
  displayName: string;
  role: Role;
  onGo: () => void;
}) {
  const emoji = role === 'teacher' ? '🎉' : role === 'parent' ? '👨‍👩‍👧' : '🌟';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{emoji}</div>
      <h1 style={{ ...heading, textAlign: 'center' }}>
        You&apos;re all set{displayName ? `, ${displayName}` : ''}!
      </h1>
      <p style={{ ...sub, textAlign: 'center', marginBottom: 32 }}>
        Your account is ready. Head to your dashboard to get started.
      </p>
      <Button variant="sun" size="md" onClick={onGo} style={{ width: '100%' }}>
        Go to Dashboard →
      </Button>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-fraunces), serif',
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--ink)',
  marginBottom: 8,
};
const sub: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--ink-soft)',
  marginBottom: 24,
  lineHeight: 1.5,
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--ink)',
  marginBottom: 6,
};
const input: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  border: '2px solid #E0DDD8',
  fontSize: 14,
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: 'var(--paper-warm)',
};

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

// ── Types ─────────────────────────────────────────────────────

type Role = 'teacher' | 'parent' | 'student';
type Step = 'email' | 'otp' | 'mfa' | 'profile' | 'role_setup' | 'done';

const AVATAR_COLORS = [
  { label: 'Sky', value: '#4ABDE8' },
  { label: 'Leaf', value: '#3EBD7A' },
  { label: 'Sun', value: '#FFB830' },
  { label: 'Coral', value: '#FF6B6B' },
  { label: 'Ink', value: '#2D2D2D' },
];

const ROLE_CONFIG: Record<Role, { title: string; placeholder: string; fieldKey: string }> = {
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

// ── Main page ────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const [role, setRole] = useState<Role | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].value);
  const [roleField, setRoleField] = useState('');

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const call = useCallback(async (fn: () => Promise<Response>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong');
      return json;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleSendOtp() {
    const data = await call(() =>
      fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }),
    );
    if (!data) return;
    setIsExistingUser(data.isExistingUser);
    setResendTimer(60);
    setStep('otp');
  }

  async function handleVerifyOtp(token: string) {
    const data = await call(() =>
      fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      }),
    );
    if (!data) return;
    if (data.mfaRequired && data.factorId) {
      setFactorId(data.factorId);
      setStep('mfa');
      return;
    }
    if (data.isExistingUser) {
      router.push('/dashboard');
    } else {
      setStep('profile');
    }
  }

  async function handleVerifyMfa(code: string) {
    const data = await call(() =>
      fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, factorId, email }),
      }),
    );
    if (!data) return;
    if (data.isExistingUser) {
      router.push('/dashboard');
    } else {
      setStep('profile');
    }
  }

  async function handleProfile() {
    const data = await call(() =>
      fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, displayName, avatarColor }),
      }),
    );
    if (!data) return;
    setStep('role_setup');
  }

  async function handleRoleSetup() {
    if (!role || !roleField) return;
    const data = await call(() =>
      fetch('/api/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentStep: 'done',
          status: 'completed',
          stepData: { [ROLE_CONFIG[role].fieldKey]: roleField },
          completedAt: new Date().toISOString(),
        }),
      }),
    );
    if (!data) return;
    setStep('done');
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
        padding: 'clamp(12px, 4vw, 24px)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: 28,
        }}
      >
        ✦ Teachly
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(24px, 6vw, 40px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.09)',
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

        {step === 'email' && (
          <EmailStep
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleSendOtp}
            loading={loading}
          />
        )}
        {step === 'otp' && (
          <OtpStep
            email={email}
            isExistingUser={isExistingUser}
            onVerify={handleVerifyOtp}
            onResend={handleSendOtp}
            resendTimer={resendTimer}
            loading={loading}
          />
        )}
        {step === 'mfa' && (
          <MfaStep onVerify={handleVerifyMfa} onFallback={handleSendOtp} loading={loading} />
        )}
        {step === 'profile' && (
          <ProfileStep
            role={role}
            displayName={displayName}
            avatarColor={avatarColor}
            onRoleChange={setRole}
            onNameChange={setDisplayName}
            onColorChange={setAvatarColor}
            onNext={handleProfile}
            loading={loading}
          />
        )}
        {step === 'role_setup' && role && (
          <RoleSetupStep
            role={role}
            value={roleField}
            onChange={setRoleField}
            onNext={handleRoleSetup}
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

// ── Email step ────────────────────────────────────────────────

function EmailStep({
  email,
  onEmailChange,
  onSubmit,
  loading,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <>
      <h1 style={heading}>Sign in or sign up</h1>
      <p style={sub}>Enter your email — we&apos;ll send a one-time code to verify it.</p>
      <label style={labelStyle}>Email address</label>
      <input
        style={inputStyle}
        type="email"
        placeholder="you@example.com"
        value={email}
        autoFocus
        onChange={(e) => onEmailChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && email && !loading && onSubmit()}
      />
      <Button
        variant="sky"
        size="md"
        onClick={onSubmit}
        disabled={!email || loading}
        style={{ width: '100%', marginTop: 24 }}
      >
        {loading ? 'Sending…' : 'Send code →'}
      </Button>
    </>
  );
}

// ── OTP step ──────────────────────────────────────────────────

function OtpStep({
  email,
  isExistingUser,
  onVerify,
  onResend,
  resendTimer,
  loading,
}: {
  email: string;
  isExistingUser: boolean;
  onVerify: (t: string) => void;
  onResend: () => void;
  resendTimer: number;
  loading: boolean;
}) {
  const [otp, setOtp] = useState('');

  return (
    <>
      <h1 style={heading}>{isExistingUser ? 'Welcome back!' : 'Check your email'}</h1>
      <p style={{ ...sub, marginBottom: 28 }}>
        We sent a 6-digit code to <strong>{email}</strong>.{' '}
        {isExistingUser ? 'Enter it to sign in.' : 'Enter it to continue.'}
      </p>

      <OtpInput
        onComplete={(code) => {
          setOtp(code);
          if (!loading) onVerify(code);
        }}
        loading={loading}
      />

      <Button
        variant="sky"
        size="md"
        onClick={() => otp && onVerify(otp)}
        disabled={otp.length < 6 || loading}
        style={{ width: '100%', marginTop: 24 }}
      >
        {loading ? 'Verifying…' : 'Verify →'}
      </Button>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        {resendTimer > 0 ? (
          <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Resend in {resendTimer}s</span>
        ) : (
          <button onClick={onResend} disabled={loading} style={linkBtn}>
            Resend code
          </button>
        )}
      </div>
    </>
  );
}

// ── MFA step ──────────────────────────────────────────────────

function MfaStep({
  onVerify,
  onFallback,
  loading,
}: {
  onVerify: (code: string) => void;
  onFallback: () => void;
  loading: boolean;
}) {
  const [code, setCode] = useState('');

  return (
    <>
      <h1 style={heading}>Two-factor verification</h1>
      <p style={{ ...sub, marginBottom: 28 }}>
        Enter the 6-digit code from your authenticator app.
      </p>

      <OtpInput
        onComplete={(c) => {
          setCode(c);
          if (!loading) onVerify(c);
        }}
        loading={loading}
      />

      <Button
        variant="sky"
        size="md"
        onClick={() => code && onVerify(code)}
        disabled={code.length < 6 || loading}
        style={{ width: '100%', marginTop: 24 }}
      >
        {loading ? 'Verifying…' : 'Verify →'}
      </Button>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={onFallback} disabled={loading} style={linkBtn}>
          Use email OTP instead
        </button>
      </div>
    </>
  );
}

// ── Profile step ──────────────────────────────────────────────

function ProfileStep({
  role,
  displayName,
  avatarColor,
  onRoleChange,
  onNameChange,
  onColorChange,
  onNext,
  loading,
}: {
  role: Role | null;
  displayName: string;
  avatarColor: string;
  onRoleChange: (v: Role) => void;
  onNameChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
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
        style={inputStyle}
        type="text"
        placeholder="e.g. Sarah"
        value={displayName}
        autoFocus
        onChange={(e) => onNameChange(e.target.value)}
      />

      <label style={{ ...labelStyle, marginTop: 20 }}>I am a…</label>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {(['teacher', 'parent', 'student'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => onRoleChange(r)}
            style={{
              flex: 1,
              padding: '10px 6px',
              borderRadius: 10,
              border: `2px solid ${role === r ? 'var(--sky)' : '#E0DDD8'}`,
              background: role === r ? 'var(--sky-light, #EAF6FC)' : 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--ink)',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <label style={labelStyle}>Avatar colour</label>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {AVATAR_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            title={c.label}
            style={{
              width: 34,
              height: 34,
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
        disabled={!displayName || !role || loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Saving…' : 'Continue →'}
      </Button>
    </>
  );
}

// ── Role setup step ───────────────────────────────────────────

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
  const cfg = ROLE_CONFIG[role];
  return (
    <>
      <h1 style={heading}>{cfg.title}</h1>
      <p style={sub}>You can always update this later from your settings.</p>
      <label style={labelStyle}>{role === 'teacher' ? 'Class name' : 'Class code'}</label>
      <input
        style={inputStyle}
        type="text"
        placeholder={cfg.placeholder}
        value={value}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && value && !loading && onNext()}
      />
      <Button
        variant="sky"
        size="md"
        onClick={onNext}
        disabled={!value || loading}
        style={{ width: '100%', marginTop: 28 }}
      >
        {loading ? 'Saving…' : 'Finish setup →'}
      </Button>
    </>
  );
}

// ── Done step ─────────────────────────────────────────────────

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

// ── OTP digit input ───────────────────────────────────────────

function OtpInput({
  onComplete,
  loading,
}: {
  onComplete: (code: string) => void;
  loading: boolean;
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function update(i: number, val: string) {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    const full = next.join('');
    if (full.length === 6 && next.every(Boolean)) onComplete(full);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      onComplete(pasted);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={loading}
          autoFocus={i === 0}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 44,
            height: 52,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 800,
            fontFamily: 'var(--font-nunito), sans-serif',
            borderRadius: 10,
            border: `2px solid ${d ? 'var(--sky)' : '#E0DDD8'}`,
            background: d ? 'var(--sky-light, #EAF6FC)' : 'white',
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border 0.1s, background 0.1s',
          }}
        />
      ))}
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

const inputStyle: React.CSSProperties = {
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

const linkBtn: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--sky)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 700,
};

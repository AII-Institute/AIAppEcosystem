import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { LogoutButton } from '@/components/auth/LogoutButton';

const ACTIVITIES = [
  {
    icon: '🎨',
    bg: 'var(--coral-light)',
    name: 'Draw your favourite planet',
    cls: 'Science Explorers · Due today',
    status: 'cta' as const,
  },
  {
    icon: '🎤',
    bg: 'var(--sky-light)',
    name: 'Record: "What is the Sun?"',
    cls: 'Science Explorers · Submitted',
    status: 'done' as const,
  },
  {
    icon: '📖',
    bg: 'var(--leaf-light)',
    name: 'Read Ch. 3 of "Magic Treehouse"',
    cls: 'Story & Reading · Due Fri',
    status: 'pending' as const,
  },
  {
    icon: '🔢',
    bg: 'var(--sun-light)',
    name: 'Counting Stars Worksheet',
    cls: 'Science Explorers · New',
    status: 'new' as const,
  },
];

const COMMUNITY = [
  {
    initial: 'S',
    bg: 'var(--sky-light)',
    color: 'var(--sky)',
    name: 'Ms. Sarah',
    role: 'Teacher',
    text: "Great session today everyone! 🌟 Mia's explanation of gravity was SO impressive. Don't forget the planet drawing activity — due this Friday!",
    time: '2 hours ago',
    reactions: [
      { emoji: '❤️', count: 6 },
      { emoji: '🌟', count: 4 },
    ],
  },
  {
    initial: 'L',
    bg: 'var(--leaf-light)',
    color: 'var(--leaf)',
    name: "Leo's Mom",
    role: 'Parent',
    text: "Leo wouldn't stop talking about black holes after class 😂 Thank you Ms. Sarah! We're doing the drawing together tonight.",
    time: '1 hour ago',
    reactions: [
      { emoji: '😂', count: 8 },
      { emoji: '❤️', count: 5 },
    ],
  },
  {
    initial: 'Z',
    bg: 'var(--sun-light)',
    color: '#8B6000',
    name: "Zoe's Dad",
    role: 'Parent',
    text: 'Zoe just submitted her voice recording! She was so proud 🥹 This is exactly what we were looking for in remote learning.',
    time: '30 min ago',
    reactions: [
      { emoji: '🥹', count: 7 },
      { emoji: '❤️', count: 9 },
    ],
  },
];

function StatusBadge({ status }: { status: 'done' | 'pending' | 'new' }) {
  const map = {
    done: { bg: 'var(--leaf-light)', color: '#1B8A4E', label: 'Done ✓' },
    pending: { bg: 'var(--sun-light)', color: '#8B6000', label: 'Pending' },
    new: { bg: 'var(--coral-light)', color: '#C0392B', label: 'New !' },
  };
  const { bg, color, label } = map[status];
  return (
    <span
      style={{
        borderRadius: 100,
        padding: '4px 12px',
        fontSize: 11,
        fontWeight: 800,
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}

export default function ParentDashboard() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-nunito), sans-serif',
        background: 'var(--paper-warm)',
        minHeight: '100vh',
      }}
    >
      {/* ── Top nav ─────────────────────────────────────────────── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 48px',
          background: 'var(--paper)',
          borderBottom: '1px solid rgba(26,26,46,0.06)',
        }}
      >
        <Logo />
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)' }}>
            Home
          </Link>
          <span
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)', cursor: 'pointer' }}
          >
            Classes
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--sky)', cursor: 'pointer' }}>
            Community
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--sky)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
                color: 'white',
              }}
            >
              J
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
              Jamie&apos;s Parent
            </span>
          </div>
          <LogoutButton variant="nav" />
        </div>
      </nav>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          minHeight: 'calc(100vh - 73px)',
        }}
      >
        {/* Left main */}
        <div style={{ padding: 32 }}>
          {/* Child selector */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {[
              { initial: 'M', name: 'Mia (age 7)', variant: 'sun' as const, active: true },
              { initial: 'T', name: 'Tom (age 9)', variant: 'leaf' as const, active: false },
            ].map(({ initial, name, variant, active }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: active ? 'var(--ink)' : 'white',
                  borderRadius: 100,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: active ? 'white' : 'var(--ink-mid)',
                  boxShadow: 'var(--shadow-soft)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: variant === 'sun' ? 'var(--sun)' : 'var(--leaf)',
                    color: variant === 'sun' ? 'var(--ink)' : 'white',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {initial}
                </div>
                {name}
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: '1.5px dashed rgba(26,26,46,0.2)',
                borderRadius: 100,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--ink-soft)',
                cursor: 'pointer',
              }}
            >
              + Add child
            </div>
          </div>

          {/* Progress cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 28,
            }}
          >
            {[
              {
                bg: 'var(--sky-light)',
                color: 'var(--sky)',
                value: '87%',
                label: 'Attendance',
                sub: '13 of 15 sessions',
              },
              {
                bg: 'var(--leaf-light)',
                color: 'var(--leaf)',
                value: '✓ 8',
                label: 'Activities Done',
                sub: '2 pending',
              },
              {
                bg: 'var(--sun-light)',
                color: '#8B6000',
                value: '⭐ 24',
                label: 'Stars Earned',
                sub: '3 badges',
              },
            ].map(({ bg, color, value, label, sub }) => (
              <div
                key={label}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: 20,
                  boxShadow: 'var(--shadow-soft)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-fraunces), serif',
                    fontSize: 20,
                    fontWeight: 700,
                    background: bg,
                    color,
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700 }}>
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* Activities header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Mia&apos;s Activities
            </div>
            <button
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(26,26,46,0.15)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--ink-mid)',
                cursor: 'pointer',
              }}
            >
              View all →
            </button>
          </div>

          {/* Activity list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ACTIVITIES.map(({ icon, bg, name, cls, status }) => (
              <div
                key={name}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: 20,
                  boxShadow: 'var(--shadow-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                    background: bg,
                  }}
                >
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}
                  >
                    {name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
                    {cls}
                  </div>
                </div>
                {status === 'cta' ? (
                  <Button variant="sun" size="sm" style={{ fontSize: 12, padding: '8px 16px' }}>
                    Start with Mia →
                  </Button>
                ) : (
                  <StatusBadge status={status} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Community panel ──────────────────────────────────── */}
        <aside
          style={{
            background: 'white',
            borderLeft: '1px solid rgba(26,26,46,0.06)',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            Class Community 💬
          </div>

          {COMMUNITY.map(({ initial, bg, color, name, role, text, time, reactions }) => (
            <div
              key={name}
              style={{
                background: 'var(--paper-warm)',
                borderRadius: 'var(--radius-sm)',
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    background: bg,
                    color,
                  }}
                >
                  {initial}
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>{name}</span>
                <span
                  style={{
                    fontSize: 10,
                    color: 'var(--ink-soft)',
                    fontWeight: 600,
                    marginLeft: 'auto',
                  }}
                >
                  {role}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{text}</p>
              <div
                style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 6, fontWeight: 600 }}
              >
                {time}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {reactions.map(({ emoji, count }) => (
                  <span
                    key={emoji}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'white',
                      borderRadius: 100,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--ink-mid)',
                    }}
                  >
                    {emoji} {count}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: 12 }}
          >
            Post to community
          </Button>
        </aside>
      </div>
    </div>
  );
}

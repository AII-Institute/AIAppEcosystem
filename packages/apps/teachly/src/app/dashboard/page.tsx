import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const CLASSES = [
  {
    id: '1',
    name: 'Science Explorers',
    emoji: '🔭',
    color: 'cc-sky',
    gradient: 'linear-gradient(135deg, #4ABDE8 0%, #2196F3 100%)',
    schedule: 'Wed & Fri · 4:00 PM · 45 min',
    next: 'Today 4:00 PM',
    students: 7,
    avatars: [
      { l: 'M', v: 'sun' },
      { l: 'L', v: 'sky' },
      { l: 'Z', v: 'leaf' },
    ],
    primaryBtn: 'Start Session',
    secondaryBtn: 'Manage',
  },
  {
    id: '2',
    name: 'Story & Reading',
    emoji: '📖',
    gradient: 'linear-gradient(135deg, #3EBD7A 0%, #1B8A4E 100%)',
    schedule: 'Mon · 3:00 PM · 30 min',
    next: 'Mon May 5',
    students: 6,
    avatars: [
      { l: 'A', v: 'coral' },
      { l: 'B', v: 'sun' },
    ],
    primaryBtn: 'Manage',
    secondaryBtn: 'Activity',
  },
  {
    id: '3',
    name: 'Art & Creativity',
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #FFB830 0%, #FF8C00 100%)',
    schedule: 'Sat · 10:00 AM · 60 min',
    next: 'Sat May 3',
    students: 5,
    avatars: [
      { l: 'C', v: 'sky' },
      { l: 'D', v: 'leaf' },
      { l: 'E', v: 'coral' },
    ],
    primaryBtn: 'Manage',
    secondaryBtn: 'Activity',
  },
];

const FEED = [
  {
    emoji: '🧒',
    bg: 'var(--sky-light)',
    text: (
      <>
        <strong>Mia</strong> submitted her drawing for &ldquo;Planets Activity&rdquo;
      </>
    ),
    time: '2 min ago · Science Explorers',
    action: 'Review',
  },
  {
    emoji: '👩',
    bg: 'var(--leaf-light)',
    text: (
      <>
        <strong>Leo&apos;s Mom</strong> posted in the community board
      </>
    ),
    time: '14 min ago · Science Explorers',
    action: 'View',
  },
  {
    emoji: '🧒',
    bg: 'var(--sun-light)',
    text: (
      <>
        <strong>Zoe</strong> completed her voice recording for &ldquo;The Sun&rdquo;
      </>
    ),
    time: '1 hr ago · Science Explorers',
    action: 'Review',
  },
];

const UPCOMING = [
  {
    time: '4:00',
    day: 'Today',
    bg: 'var(--sky-light)',
    timeColor: 'var(--sky)',
    name: '🔭 Science Explorers',
    students: '7 students · 6 parents joining',
  },
  {
    time: '3:00',
    day: 'Mon',
    bg: 'var(--leaf-light)',
    timeColor: 'var(--leaf)',
    name: '📖 Story & Reading',
    students: '6 students · 5 parents joining',
  },
  {
    time: '10:00',
    day: 'Sat',
    bg: 'var(--sun-light)',
    timeColor: '#8B6000',
    name: '🎨 Art & Creativity',
    students: '5 students · 4 parents joining',
  },
];

const avatarBg: Record<string, string> = {
  sun: 'var(--sun)',
  sky: 'var(--sky)',
  leaf: 'var(--leaf)',
  coral: 'var(--coral)',
};
const avatarColor: Record<string, string> = {
  sun: 'var(--ink)',
  sky: '#fff',
  leaf: '#fff',
  coral: '#fff',
};

export default function TeacherDashboard() {
  return (
    <div className="r-sidebar-layout" style={{ background: 'var(--paper-warm)' }}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="r-sidebar-desktop"
        style={{
          background: 'var(--ink)',
          padding: '28px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 22,
            fontWeight: 700,
            color: 'white',
            padding: '0 24px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 20,
          }}
        >
          ✦ Teachly
        </div>

        <SidebarSection label="Main">
          <SidebarItem icon="🏠" label="Dashboard" active href="/dashboard" />
          <SidebarItem icon="📚" label="My Classes" badge="3" href="/dashboard" />
          <SidebarItem icon="📅" label="Schedule" href="/dashboard" />
          <SidebarItem icon="📝" label="Activities" badge="5" href="/dashboard" />
        </SidebarSection>

        <SidebarSection label="Community">
          <SidebarItem icon="💬" label="Messages" badge="2" href="/dashboard" />
          <SidebarItem icon="🌟" label="Community Board" href="/dashboard" />
          <SidebarItem icon="👨‍👩‍👧" label="Parents" href="/dashboard" />
        </SidebarSection>

        <SidebarSection label="Account">
          <SidebarItem icon="⚙️" label="Settings" href="/dashboard" />
        </SidebarSection>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '20px 24px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--sun)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--ink)',
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Ms. Sarah</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Teacher · Pro Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main style={{ padding: 'clamp(16px, 4vw, 32px)', overflow: 'auto' }}>
        {/* Mobile-only top bar */}
        <div
          style={{
            display: 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(26,26,46,0.08)',
          }}
          className="r-mobile-topbar"
        >
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--sun)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
                color: 'var(--ink)',
              }}
            >
              S
            </div>
          </div>
        </div>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Good morning, Sarah ☀️
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, fontWeight: 600 }}>
              Wednesday, April 30 · 3 sessions this week
            </div>
          </div>
          <Button variant="sun" size="sm">
            + New Class
          </Button>
        </div>

        {/* Stats */}
        <div className="r-grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: '👧', value: '18', label: 'Active Students', change: '↑ 2 this week' },
            { icon: '📚', value: '3', label: 'Active Classes', change: '↑ 1 new class' },
            { icon: '✅', value: '24', label: 'Activities Done', change: '↑ 89% completion' },
            { icon: '💰', value: '$420', label: 'This Month', change: '↑ vs last month' },
          ].map(({ icon, value, label, change }) => (
            <div
              key={label}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                padding: 20,
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}
              >
                {value}
              </div>
              <div
                style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700, marginTop: 2 }}
              >
                {label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--leaf)', fontWeight: 700, marginTop: 6 }}>
                {change}
              </div>
            </div>
          ))}
        </div>

        {/* Classes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
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
            My Classes
          </div>
          <button
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(26,26,46,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--ink-mid)',
              cursor: 'pointer',
            }}
          >
            View all →
          </button>
        </div>

        <div className="r-grid-3-sm" style={{ marginBottom: 28 }}>
          {CLASSES.map((cls) => (
            <div
              key={cls.id}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div style={{ padding: 20, background: cls.gradient, position: 'relative' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{cls.emoji}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: 4,
                  }}
                >
                  {cls.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                  {cls.schedule}
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    {cls.avatars.map(({ l, v }) => (
                      <div
                        key={l}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '2px solid white',
                          marginRight: -6,
                          fontSize: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          background: avatarBg[v],
                          color: avatarColor[v],
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
                    {cls.students} students
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-mid)',
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Next: <strong style={{ color: 'var(--sky)' }}>{cls.next}</strong>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 800,
                      background: 'var(--ink)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {cls.primaryBtn}
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 800,
                      background: 'var(--paper-warm)',
                      color: 'var(--ink-mid)',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {cls.secondaryBtn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="r-panel-layout" style={{ gap: 16, minHeight: 'unset' }}>
          {/* Activity feed */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}
              >
                Recent Activity
              </div>
              <button
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(26,26,46,0.15)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--ink-mid)',
                  cursor: 'pointer',
                }}
              >
                View all
              </button>
            </div>
            {FEED.map(({ emoji, bg, text, time, action }) => (
              <div
                key={time}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(26,26,46,0.06)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>
                    {text}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-soft)',
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    {time}
                  </div>
                </div>
                <button
                  style={{
                    background: 'var(--leaf-light)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#1B8A4E',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    flexShrink: 0,
                  }}
                >
                  {action}
                </button>
              </div>
            ))}
          </div>

          {/* Upcoming sessions */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: 12,
              }}
            >
              Upcoming Sessions
            </div>
            {UPCOMING.map(({ time, day, bg, timeColor, name, students }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(26,26,46,0.06)',
                }}
              >
                <div
                  style={{
                    background: bg,
                    borderRadius: 8,
                    padding: '6px 10px',
                    textAlign: 'center',
                    minWidth: 52,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: timeColor }}>{time}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontWeight: 600 }}>
                    {day}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>
                    {students}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '0 24px',
          marginBottom: 6,
          marginTop: 16,
        }}
      >
        {label}
      </div>
      <div style={{ padding: '0 12px', marginBottom: 8 }}>{children}</div>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  badge,
  href,
}: {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 700,
        color: active ? 'white' : 'rgba(255,255,255,0.55)',
        background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
        marginBottom: 2,
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{icon}</span>
      {label}
      {badge && (
        <span
          style={{
            marginLeft: 'auto',
            background: 'var(--sun)',
            color: 'var(--ink)',
            fontSize: 10,
            fontWeight: 800,
            borderRadius: 100,
            padding: '2px 7px',
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

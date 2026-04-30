const CLASSES = [
  {
    emoji: '🔭',
    name: 'Science Explorers',
    teacher: 'with Ms. Sarah',
    badge: 'Draw planets! 🎨',
    badgeDone: false,
  },
  {
    emoji: '📖',
    name: 'Story & Reading',
    teacher: 'with Ms. Sarah',
    badge: 'All done! ✓',
    badgeDone: true,
  },
  {
    emoji: '🎨',
    name: 'Art & Creativity',
    teacher: 'with Ms. Sarah',
    badge: 'All done! ✓',
    badgeDone: true,
  },
];

const BADGES = [
  { icon: '🌟', name: 'Star Student', bg: 'var(--sky-light)', earned: true },
  { icon: '🎨', name: 'Art Explorer', bg: 'var(--sun-light)', earned: true },
  { icon: '📖', name: 'Bookworm', bg: 'var(--leaf-light)', earned: true },
  { icon: '🔬', name: 'Scientist', bg: 'var(--coral-light)', earned: false },
  { icon: '🏆', name: 'Champion', bg: 'var(--sky-light)', earned: false },
  { icon: '🚀', name: 'Space Ace', bg: 'var(--sun-light)', earned: false },
];

export default function KidView() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-nunito), sans-serif',
        background: 'linear-gradient(160deg, #E8F7FF 0%, #FFF9E8 50%, #E8FFF3 100%)',
        minHeight: '100vh',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background star */}
      <div
        style={{
          position: 'fixed',
          fontSize: 80,
          top: -10,
          right: -10,
          opacity: 0.12,
          transform: 'rotate(15deg)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ⭐
      </div>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          maxWidth: 860,
          margin: '0 auto 32px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--ink)',
          }}
        >
          ✦ Teachly
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'white',
            borderRadius: 100,
            padding: '8px 16px',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
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
            M
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>Mia</span>
          <span style={{ fontSize: 13 }}>⭐ 24</span>
        </div>
      </div>

      {/* ── Greeting ────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 32,
          maxWidth: 860,
          margin: '0 auto 32px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 36,
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 8,
          }}
        >
          Hi, <em style={{ fontStyle: 'italic', color: 'var(--sky)' }}>Mia!</em> 👋
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink-mid)', fontWeight: 600 }}>
          You have 1 activity to do today. Let&apos;s go!
        </div>
      </div>

      {/* ── Classes ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 28,
          maxWidth: 860,
          margin: '0 auto 28px',
        }}
      >
        {CLASSES.map(({ emoji, name, teacher, badge, badgeDone }) => (
          <div
            key={name}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              textAlign: 'center',
              boxShadow: 'var(--shadow-soft)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>{emoji}</div>
            <div
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: 4,
              }}
            >
              {name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>{teacher}</div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                background: badgeDone ? 'var(--leaf-light)' : 'var(--coral-light)',
                color: badgeDone ? 'var(--leaf)' : 'var(--coral)',
                borderRadius: 100,
                padding: '3px 10px',
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              {badge}
            </div>
          </div>
        ))}
      </div>

      {/* ── Achievements ─────────────────────────────────────────── */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-md)',
          padding: 20,
          boxShadow: 'var(--shadow-soft)',
          maxWidth: 860,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 12,
          }}
        >
          🏆 My Badges
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {BADGES.map(({ icon, name, bg, earned }) => (
            <div
              key={name}
              style={{
                textAlign: 'center',
                flex: 1,
                opacity: earned ? 1 : 0.3,
                filter: earned ? 'none' : 'grayscale(1)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  margin: '0 auto 6px',
                  background: bg,
                }}
              >
                {icon}
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mid)' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-nunito), sans-serif',
        background: 'var(--paper)',
        minHeight: '100vh',
      }}
    >
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="r-nav">
        <Logo />
        <div className="r-nav-links">
          <Link
            href="/dashboard"
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)' }}
          >
            For Teachers
          </Link>
          <Link href="/parent" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)' }}>
            For Parents
          </Link>
          <span
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)', cursor: 'pointer' }}
          >
            Pricing
          </span>
        </div>
        <Button variant="primary" size="sm">
          Log in
        </Button>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="r-hero r-section-pad"
        style={{
          padding: '64px 48px 0',
          minHeight: 480,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Left copy */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--sun-light)',
              border: '1.5px solid var(--sun)',
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 800,
              color: '#8B6000',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            🌟 Remote learning, reimagined
          </div>

          <h1
            className="r-h1"
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--ink)',
              marginBottom: 20,
            }}
          >
            Where kids,
            <br />
            parents &amp; teachers
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--sky)' }}>learn together.</em>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: 'var(--ink-mid)',
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 420,
            }}
          >
            Live classes, async activities, and a community that keeps families close — even when
            they&apos;re apart.
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard">
              <Button variant="sun" size="lg">
                Start your classroom →
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              See how it works
            </Button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[
                { l: 'S', v: 'sun' as const },
                { l: 'M', v: 'sky' as const },
                { l: 'J', v: 'leaf' as const },
              ].map(({ l, v }, i) => (
                <div
                  key={l}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginRight: -6,
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    background:
                      v === 'sun' ? 'var(--sun)' : v === 'sky' ? 'var(--sky)' : 'var(--leaf)',
                    color: v === 'sun' ? 'var(--ink)' : '#fff',
                    zIndex: 3 - i,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
              1,200+ families already learning together
            </span>
          </div>
        </div>

        {/* Right visual — live class preview */}
        <div
          className="r-hero-visual"
          style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 20 }}
        >
          {/* Live classroom card */}
          <div
            style={{
              background: 'var(--ink)',
              borderRadius: '20px 20px 0 0',
              padding: 24,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative circle */}
            <div
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                background: 'var(--sky)',
                borderRadius: '50%',
                opacity: 0.12,
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--coral)',
                borderRadius: 100,
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 800,
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'white',
                  display: 'inline-block',
                }}
              />
              Live Now
            </div>

            <div
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              🔭 Science Explorers
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
              with Ms. Sarah · Wednesday 4:00 PM
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}
            >
              {[
                { emoji: '🧒', name: 'Mia' },
                { emoji: '👩', name: 'Mom' },
                { emoji: '🧒', name: 'Leo' },
                { emoji: '👨', name: 'Dad' },
                { emoji: '🧒', name: 'Zoe' },
                { emoji: null, name: '+3 more' },
              ].map(({ emoji, name }) => (
                <div
                  key={name}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    padding: 10,
                    textAlign: 'center',
                    fontSize: emoji ? 24 : 12,
                    opacity: emoji ? 1 : 0.4,
                  }}
                >
                  {emoji ?? ''}
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>{name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div
              style={{
                background: 'var(--leaf-light)',
                borderRadius: 14,
                padding: 14,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20 }}>🎨</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#1B8A4E', marginTop: 4 }}>
                Draw &amp; Share
              </div>
              <div
                style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2, fontWeight: 600 }}
              >
                Async activity
              </div>
            </div>
            <div
              style={{
                background: 'var(--sun-light)',
                borderRadius: 14,
                padding: 14,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20 }}>📊</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#8B6000', marginTop: 4 }}>
                Progress Tracker
              </div>
              <div
                style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2, fontWeight: 600 }}
              >
                For parents
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature strips ──────────────────────────────────────── */}
      <section
        className="r-grid-3 r-section-pad"
        style={{
          maxWidth: 1200,
          margin: '80px auto 0',
          padding: '0 48px 80px',
        }}
      >
        {[
          {
            icon: '📹',
            color: 'var(--sky-light)',
            title: 'Live Classes',
            desc: 'Real-time sessions with video, reactions, and raise-hand tools built for young learners.',
          },
          {
            icon: '🎨',
            color: 'var(--leaf-light)',
            title: 'Async Activities',
            desc: 'Drawings, voice recordings, worksheets — kids complete them at their own pace.',
          },
          {
            icon: '💬',
            color: 'var(--sun-light)',
            title: 'Parent Community',
            desc: 'A safe space for teachers and parents to share progress, celebrate wins, and connect.',
          },
        ].map(({ icon, color, title, desc }) => (
          <div
            key={title}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: 28,
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                background: color,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              {icon}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                color: 'var(--ink)',
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

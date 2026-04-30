import type { CSSProperties } from 'react';

interface LogoProps {
  size?: number;
  style?: CSSProperties;
}

export function Logo({ size = 28, style }: LogoProps) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-fraunces), serif',
        fontSize: size,
        fontWeight: 700,
        color: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          background: 'var(--sun)',
          borderRadius: '50%',
          display: 'inline-block',
          marginBottom: 2,
        }}
      />
      Teachly
    </div>
  );
}

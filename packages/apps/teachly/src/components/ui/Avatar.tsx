import type { CSSProperties } from 'react';

type AvatarVariant = 'sun' | 'sky' | 'leaf' | 'coral';

const BG: Record<AvatarVariant, CSSProperties> = {
  sun: { background: 'var(--sun)', color: 'var(--ink)' },
  sky: { background: 'var(--sky)', color: '#fff' },
  leaf: { background: 'var(--leaf)', color: '#fff' },
  coral: { background: 'var(--coral)', color: '#fff' },
};

interface AvatarProps {
  label: string;
  variant?: AvatarVariant;
  size?: number;
  style?: CSSProperties;
}

export function Avatar({ label, variant = 'sun', size = 32, style }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.44,
        flexShrink: 0,
        ...BG[variant],
        ...style,
      }}
    >
      {label}
    </div>
  );
}

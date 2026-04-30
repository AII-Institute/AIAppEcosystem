import type { ButtonHTMLAttributes, CSSProperties } from 'react';

type ButtonVariant = 'primary' | 'sun' | 'sky' | 'leaf' | 'ghost' | 'outline';

const STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: { background: 'var(--ink)', color: '#fff', border: 'none' },
  sun: { background: 'var(--sun)', color: 'var(--ink)', border: 'none' },
  sky: { background: 'var(--sky)', color: '#fff', border: 'none' },
  leaf: { background: 'var(--leaf)', color: '#fff', border: 'none' },
  ghost: {
    background: 'transparent',
    color: 'var(--ink-mid)',
    border: '1.5px solid rgba(26,26,46,0.15)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--ink)',
    border: '2px solid rgba(26,26,46,0.15)',
  },
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_STYLES: Record<string, CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: 12 },
  md: { padding: '12px 24px', fontSize: 14 },
  lg: { padding: '14px 28px', fontSize: 15 },
};

export function Button({ variant = 'primary', size = 'md', style, children, ...rest }: ButtonProps) {
  return (
    <button
      style={{
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-nunito), sans-serif',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

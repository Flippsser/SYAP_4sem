import type { ReactNode } from 'react';
import styles from './LayoutCard.module.css';

interface LayoutCardProps {
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function LayoutCard({ title, children, footer }: LayoutCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {title}
      </div>

      <div className={styles.content}>
        {children}
      </div>

      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
}
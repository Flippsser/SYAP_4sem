import cn from 'classnames';
import styles from './Badge.module.css';

type BadgeColor = 'green' | 'red' | 'orange' | 'blue';

interface BadgeProps {
  color: BadgeColor;
  text: string;
}

export function Badge({ color, text }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[color])}>
      {text}
    </span>
  );
}
import cn from 'classnames';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isFullWidth?: boolean;
}

export function Input({
  label,
  error,
  isFullWidth = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div
      className={cn(styles.wrapper, {
        [styles.fullWidth]: isFullWidth,
      })}
    >
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        className={cn(
          styles.input,
          {
            [styles.inputError]: error,
          },
          className
        )}
        {...props}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
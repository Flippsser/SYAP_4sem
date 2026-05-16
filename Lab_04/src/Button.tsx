import React from "react";
type ButProps = {
  title: string;
  callback: () => void;
  disabled?: boolean;
};
export const Button: React.FC<ButProps> = ({ title, callback, disabled }) => {
  return (
    <button onClick={callback} disabled={disabled}>
      {title}
    </button>
  );
};

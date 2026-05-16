import React, { useState } from "react";
import { Button } from "./Button";

export const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const increase = () => {
    setCount(prev => prev + 1);
  };

    const increaseminus = () => {
    setCount(prev => prev - 1);
  };

  const reset = () => {
    setCount(0);
  };

  const isIncreaseDisabled = count >= 5;
  const isResetDisabled = count == 0;
  
  const isincreaseminus = count == 0;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>{count}</h1>

      <Button
        title="increase"
        callback={increase}
        disabled={isIncreaseDisabled}
      />

      <Button
        title="reset"
        callback={reset}
        disabled={isResetDisabled}
      />

            <Button
        title="reset"
        callback={increaseminus}
        disabled={isincreaseminus}/>
    </div>
  );
};

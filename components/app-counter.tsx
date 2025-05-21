'use client'
import React, { useState } from "react";
import AppButton from "./app-button";

const AppCounter = () => {
      const [count, setCount] = useState<number>(0);
      return <AppButton text={`Count: ${count}`} onClick={() => setCount((pv) => pv + 1)} />;
};

export default AppCounter;

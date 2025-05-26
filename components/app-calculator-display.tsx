import { add } from "@/utils/math";
import React from "react";

const AppCalculatorDisplay = () => {
      const sum = add(2, 4);
      return (
            <div className="h-screen w-screen flex items-center justify-center">
                  <h1 className="text-4xl font-bold">Sum: {sum}</h1>
            </div>
      );
};

export default AppCalculatorDisplay;

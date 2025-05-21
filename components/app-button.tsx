import React from "react";

const AppButton = ({ text, onClick }: { text: string; onClick?: any }) => {
      return <button onClick={onClick}>{text}</button>;
};

export default AppButton;

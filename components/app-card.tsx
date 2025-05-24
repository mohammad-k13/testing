import React from "react";

const AppCard = ({ text }: { text: string }) => {
      return (
            <div className="w-fit h-fit rounded-2xl flex items-center justify-center border-[1px] border-gray-700 hover:border-gray-500 trannsition-color ">
                  {text}
            </div>
      );
};

export default AppCard;

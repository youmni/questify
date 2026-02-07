import React from "react";

const QuestifyIcon = ({ icon = "#", size = 35 }) => {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 bg-gray-300 text-cyan-950"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.6}px`
      }}
      aria-hidden="true"
    >
      {icon}
    </div>
  );
};

export default QuestifyIcon;
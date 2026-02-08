import React from "react";

const TextHeader = ({ title, subtext }) => {
  return (
    <div className="py-[10px]">
      <h1 className="font-serif text-2xl font-bold m-0 text-cyan-950 inline-block">
        {title}
      </h1>
      <span className="font-sans text-sm text-slate-500 mt-1 block">
        {subtext}
      </span>
    </div>
  );
};

export default TextHeader;
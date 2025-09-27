import React from 'react';

type BoxProps = {
  emoji: string;
  title: string;
  text: string;
  onClick?: () => void;
};

const Box: React.FC = ({ emoji, title, text, onClick }: BoxProps) => (
  <button
    onClick={onClick}
    className="group rounded-lg border border-transparent px-5 py-4 hover:border-slate-200 hover:bg-white text-left"
    rel="noopener noreferrer"
  >
    <h2 className={`mb-3 text-2xl font-semibold`}>
      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none mr-2">
        {emoji}
      </span>
      {title}
    </h2>
    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{text}</p>
  </button>
);

export default Box;

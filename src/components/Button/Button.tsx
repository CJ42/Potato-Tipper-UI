import React from 'react';

type ButtonProps = {
  bgClass: string;
  text: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, onClick, bgClass }) => (
  <button
    type="button"
    className={`m-2 ${bgClass} text-white font-bold py-2 px-4 rounded`}
    onClick={onClick}
  >
    {text}
  </button>
);

export default Button;

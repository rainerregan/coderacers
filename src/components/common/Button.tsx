import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  ...props
}) => {
  return (
    <button
      {...props}
      className='p-4 rounded-lg hover:bg-gray-600 transition'
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
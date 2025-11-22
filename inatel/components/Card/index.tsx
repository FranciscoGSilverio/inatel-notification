import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Card({ children, className = '', id }: CardProps) {
  return (
    <div
      id={id}
      className={`bg-white rounded-2xl shadow-md p-6 ${className}`}
    >
      {children}
    </div>
  );
}


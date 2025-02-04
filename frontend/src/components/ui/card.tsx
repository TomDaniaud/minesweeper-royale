import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => {
  return <div className="mt-2">{children}</div>;
};

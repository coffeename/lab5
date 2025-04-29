import React, { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...rest }) => (
  <div
    className={
      // базові стилі + передана нами className
      `border rounded-lg shadow-sm p-4 ${className || ''}`
    }
    {...rest}
  >
    {children}
  </div>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={className} {...rest}>
    {children}
  </div>
);

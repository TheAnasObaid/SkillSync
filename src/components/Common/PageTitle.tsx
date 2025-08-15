"use client";

import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

const PageTitle = ({ title, subtitle, icon }: PageTitleProps) => {
  return (
    <div className="text-center py-12 md:py-16">
      {icon && (
        <div className="mx-auto text-5xl text-primary mb-4 w-fit">{icon}</div>
      )}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default PageTitle;

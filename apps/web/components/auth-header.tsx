'use client';

import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <header className="w-full">
      <div className="mb-1 flex justify-center">
        <Image
          src="/task-manager-hero.png"
          alt="Task Manager"
          width={128}
          height={128}
          priority
          unoptimized
          sizes="128px"
          className="h-32 w-auto object-contain"
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-normal text-gray-900 tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-4 text-[15px] font-medium text-gray-700 leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}

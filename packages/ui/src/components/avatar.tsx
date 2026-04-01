import { cn } from '../utils/cn';

interface AvatarProps {
  name: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-xl',
};

export function Avatar({
  name,
  lastName,
  size = 'md',
  className,
}: AvatarProps) {
  const initials = `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className={cn(
        'rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center select-none',
        sizeMap[size],
        className,
      )}
      title={`${name} ${lastName}`}
    >
      {initials}
    </div>
  );
}

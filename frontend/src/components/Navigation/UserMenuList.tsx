import { ReactNode } from 'react';

interface UserMenuListProps {
  onToggle: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

const UserMenuList = ({ onToggle, children }: UserMenuListProps) => {
  return (
    <>
      <div
        onClick={onToggle}
        className='fixed inset-0'></div>
      <ul className='absolute top-[115%] right-0 w-fit py-2 border dark:border-zinc-600 bg-zinc-50 dark:text-zinc-50 dark:bg-zinc-700 rounded-lg drop-shadow-xl overflow-hidden'>{children}</ul>
    </>
  );
};

export default UserMenuList;

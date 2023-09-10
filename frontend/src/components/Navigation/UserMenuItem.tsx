import { ReactNode } from 'react';

interface UserMenuItemProps {
  label: string;
  icon: ReactNode;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

const UserMenuItem = ({ label, icon, onClick }: UserMenuItemProps) => {
  return (
    <li
      onClick={onClick}
      className='px-3 py-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 cursor-pointer'>
      <div className='flex justify-start items-center gap-3'>
        {icon}
        <span>{label}</span>
      </div>
    </li>
  );
};

export default UserMenuItem;

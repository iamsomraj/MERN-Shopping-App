import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { InboxStackIcon } from '@heroicons/react/20/solid';

const InventoryCard = () => {
  return (
    <div className='p-6 rounded-xl border dark:border-zinc-500/50 flex flex-col gap-6'>
      <p className='text-4xl font-medium'>Check Inventory</p>
      <div className='w-fit'>
        <Button>
          <Link to={'/inventory'}>
            <div className='flex justify-center items-center gap-3'>
              <InboxStackIcon className='h-5 w-5 flex-shrink-0' />
              <span>Visit</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InventoryCard;

import Button from '@/components/UI/Button';
import { ICartProduct } from '@/types';
import { ArrowPathIcon, MinusCircleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/20/solid';

interface ProductRowItemProps {
  product: ICartProduct;
  deleteSingleItem: (product: ICartProduct) => void;
  redirectToProduct: (product: ICartProduct) => void;
  shouldAddRoundedBorders?: boolean;
  showProductStock?: boolean;
  isProductActionOngoing?: boolean;
}

const ProductRowItem = ({ product, deleteSingleItem, redirectToProduct, shouldAddRoundedBorders, showProductStock, isProductActionOngoing }: ProductRowItemProps) => {
  return (
    <>
      {/* BEGIN - PRODUCT CART ITEM */}
      <div
        key={product._id}
        className={`flex justify-between w-full transition-all duration-300 bg-zinc-50 dark:bg-zinc-700 items-center gap-6 px-12 py-6 border ${shouldAddRoundedBorders ? 'rounded-lg' : ''} dark:border-zinc-500/50`}>
        {/* BEGIN - IMAGE, NAME, PRICE */}
        <div className='flex flex-col md:flex-row justify-start md:items-center gap-6'>
          <div className='bg-zinc-100 w-fit dark:bg-zinc-300 p-3 rounded-lg drop-shadow'>
            <img
              className='h-24 w-24 rounded-lg mix-blend-multiply object-cover object-center overflow-hidden flex-shrink-0'
              src={product.image}
            />
          </div>
          <div className='flex flex-col gap-3 dark:text-zinc-200'>
            <p
              onClick={() => redirectToProduct(product)}
              className='text-2xl font-medium line-clamp-2 hover:underline hover:cursor-pointer'>
              {product.name}
            </p>
            <p>$ {product.price}</p>
            {showProductStock ? (
              <p className='text-lg font-bold text-zinc-900'>
                {product.qtyInStock || 1} {(product.qtyInStock || 1) > 1 ? 'Stocks' : 'Stock'}
              </p>
            ) : (
              <p className='text-lg font-bold text-zinc-900'>
                {product.qty || 1} {(product.qty || 1) > 1 ? 'Quantities' : 'Quantity'}
              </p>
            )}
          </div>
        </div>
        {/* END - IMAGE, NAME, PRICE */}

        {/* BEGIN - DELETE ITEM */}
        <Button
          disabled={isProductActionOngoing}
          onClick={() => {
            if (isProductActionOngoing) {
              return;
            }

            deleteSingleItem(product);
          }}>
          <div className='flex gap-3 items-center'>
            {isProductActionOngoing ? (
              <ArrowPathIcon className='h-5 w-5 flex-shrink-0 animate-spin' />
            ) : showProductStock ? (
              product.isAvailable ? (
                <MinusCircleIcon
                  key={'delete'}
                  className='h-5 w-5 flex-shrink-0'
                />
              ) : (
                <>
                  <span key={'undo'}>Undo</span>
                  <PlusCircleIcon
                    key={'undo-plus-icon'}
                    className='h-5 w-5 flex-shrink-0'
                  />
                </>
              )
            ) : (
              <TrashIcon className='h-5 w-5 flex-shrink-0' />
            )}
          </div>
        </Button>
        {/* END - DELETE ITEM */}
      </div>
      {/* END - PRODUCT CART ITEM */}
    </>
  );
};

export default ProductRowItem;

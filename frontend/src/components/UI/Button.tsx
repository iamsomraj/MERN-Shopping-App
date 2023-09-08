import { ArrowPathIcon } from '@heroicons/react/20/solid';

type Props = {
  variant?: 'primary' | 'transparent';
  loading?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

const PrimaryButton = (props: Props) => {
  const { children, ...rest } = props;
  const content = rest.loading ? <ArrowPathIcon className='h-5 w-5 flex-shrink-0 animate-spin' /> : children;
  return (
    <button
      className='px-3 py-3 font-bold rounded-lg flex justify-center items-center bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 duration-300 transition-all'
      {...rest}>
      {content}
    </button>
  );
};

const TransparentButton = (props: Props) => {
  const { children, ...rest } = props;
  const content = rest.loading ? <ArrowPathIcon className='h-5 w-5 flex-shrink-0 animate-spin' /> : children;
  return (
    <button
      className='px-3 py-3 rounded-lg flex justify-center items-center dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 duration-300 transition-all'
      {...rest}>
      {content}
    </button>
  );
};

const Button = (props: Props) => {
  const { variant: propVariant, loading: propLoading, children: propChildren, ...rest } = props;
  const variant = propVariant || 'primary';
  const loading = propLoading || undefined;
  const children = propChildren || null;

  const buttonVariants = {
    primary: PrimaryButton,
    transparent: TransparentButton,
  };

  const Component = buttonVariants[variant];

  return (
    <Component
      variant={variant}
      loading={loading}
      {...rest}>
      {children}
    </Component>
  );
};

export default Button;

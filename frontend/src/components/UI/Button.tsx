type Props = {
  variant?: 'primary' | 'transparent';
  loading?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

const PrimaryButton = (props: Props) => {
  const { children, ...rest } = props;

  return (
    <button
      className='px-6 py-3 font-bold rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800'
      {...rest}>
      {children}
    </button>
  );
};

const TransparentButton = (props: Props) => {
  const { children, ...rest } = props;
  return (
    <button
      className='px-1 py-3 rounded-lg dark:text-zinc-50 hover:bg-zinc-100'
      {...rest}>
      {children}
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

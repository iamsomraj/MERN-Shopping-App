type Props = {
  variant?: 'primary' | 'transparent';
  loading?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

const PrimaryButton = (props: Props) => {
  const { children, ...rest } = props;

  return (
    <button
      className='bg-zinc-900 text-white py-3 px-6 rounded-lg font-bold hover:bg-zinc-800'
      {...rest}>
      {children}
    </button>
  );
};

const TransparentButton = (props: Props) => {
  const { children, ...rest } = props;
  return (
    <button
      className='py-3 px-6 rounded-lg hover:bg-zinc-100'
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

type Props = {
  variant?: 'primary';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
};

const PrimaryButton = (props: Props) => {
  return <button className='bg-zinc-900 text-white py-3 px-6 rounded-lg font-bold'>{props.children}</button>;
};

const Button = (props: Props) => {
  const variant = props?.variant || 'primary';
  const loading = props?.loading || false;
  const disabled = props?.disabled || false;
  const children = props?.children || null;

  const buttonVariants = {
    primary: PrimaryButton,
  };

  const Component = buttonVariants[variant];

  return (
    <Component
      variant={variant}
      loading={loading}
      disabled={disabled}>
      {children}
    </Component>
  );
};

export default Button;

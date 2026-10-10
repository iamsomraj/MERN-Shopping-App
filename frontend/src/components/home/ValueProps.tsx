import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const PROPS = [
  { icon: Truck, title: 'Free shipping over $100', text: 'Flat $9.99 on smaller orders' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Pay safely with PayPal' },
  { icon: RotateCcw, title: '30-day returns', text: 'Changed your mind? No problem' },
];

export function ValueProps() {
  return (
    <section className='container'>
      <ul className='grid gap-6 rounded-2xl border bg-muted/40 p-6 sm:grid-cols-3'>
        {PROPS.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className='flex items-center gap-4'>
            <span className='flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background text-primary shadow-xs'>
              <Icon className='size-5' />
            </span>
            <div>
              <p className='text-sm font-semibold'>{title}</p>
              <p className='text-sm text-muted-foreground'>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

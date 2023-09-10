import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PaypalProviderProps {
  paypalClientId: string;
  onPaymentSuccess: () => Promise<void>;
  onPaymentError: () => Promise<void>;
}

const PaypalProvider = ({ paypalClientId, onPaymentSuccess, onPaymentError }: PaypalProviderProps) => {
  return (
    <div className='w-fit z-0'>
      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
        <PayPalButtons
          style={{ shape: 'pill' }}
          onApprove={onPaymentSuccess}
          onCancel={onPaymentError}
          onError={onPaymentError}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalProvider;

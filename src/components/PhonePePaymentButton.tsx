// src/components/payments/PhonePePaymentButton.tsx
import React from 'react'
import { toast } from 'sonner'

interface Props {
  productId: string
  amount: number // in rupees
}

const PhonePePaymentButton: React.FC<Props> = ({ productId, amount }) => {
  const initiatePayment = async () => {
    try {
      toast.info('Initiating payment...')
      const res = await fetch('https://www.minutehire.com/api/phonepe/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, amount }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Payment failed')

      // ✅ Open PayPage (Redirect Mode)
      if (window.PhonePeCheckout?.transact) {
        window.PhonePeCheckout.transact({ tokenUrl: data.data.redirectUrl })
        toast.success('Redirecting to PhonePe PayPage...')
      } else {
        throw new Error('PhonePe Checkout not available')
      }
    } catch (err: any) {
      toast.error(err.message || 'PhonePe payment failed')
      console.error('❌ PhonePe error:', err)
    }
  }

  return (
    <button
      onClick={initiatePayment}
      className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
    >
      Pay ₹{amount} with PhonePe
    </button>
  )
}

export default PhonePePaymentButton

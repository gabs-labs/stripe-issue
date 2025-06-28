import {
  confirmPlatformPayPayment,
  isPlatformPaySupported,
  PaymentIntent,
  PlatformPay,
  PlatformPayButton
} from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const defaultAmount = '2000'

export default function Index() {
  const [amount, setAmount] = useState(defaultAmount)
  const [clientSecret, setClientSecret] = useState('')
  const [intentId, setIntentId] = useState('')
  const [status, setStatus] = useState('')
  const [isPaySupported, setIsPaySupported] = useState(false);
  
  useEffect(() => {
    (async function () {
      setIsPaySupported(
        await isPlatformPaySupported(),
      );
    })();
  }, []);

  const createPaymentIntent = async () => {
    const body = `amount=${amount}&currency=gbp`
    console.log(`>>> Creating payment intent: ${body}`)

    const response = await fetch(
      'https://api.stripe.com/v1/payment_intents',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.EXPO_PUBLIC_STRIPE_API_KEY}:`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      }
    )
    const paymentIntent = await response.json()
    console.log(paymentIntent)

    if (paymentIntent.client_secret && paymentIntent.id) {
      setClientSecret(paymentIntent.client_secret)
      setIntentId(paymentIntent.id)
    }
  }

  const confirmPayment = async () => {
    console.log(`>>> ${new Date().toISOString()} >>> about to pay`)

    const { error, paymentIntent } = await confirmPlatformPayPayment(
      clientSecret,
      {
        applePay: {
          cartItems: [
            {
              label: "Products",
              amount: (parseInt(amount, 10) / 100).toFixed(2),
              paymentType: PlatformPay.PaymentType.Immediate,
            }
          ],
          merchantCountryCode: "GB",
          currencyCode: "GBP",
        }
      },
    );

    console.log(`>>> ${new Date().toISOString()} >>> finished: error=${JSON.stringify(error)} & status=${paymentIntent?.status}`)

    if (error || paymentIntent?.status !== PaymentIntent.Status.Succeeded) {
      setStatus(`Payment not completed: ${JSON.stringify(error)}, ${paymentIntent?.status}`);
    }

    setStatus(`Payment completed: ${paymentIntent?.status}`)
  };

  const startOver = () => {
    setAmount(defaultAmount)
    setClientSecret('')
    setIntentId('')
    setStatus('')
  }

  return (
    <View style={styles.container}>
      {clientSecret === '' &&
        <>
          <Text style={styles.text}>1. Create payment intent</Text>
          <TextInput style={styles.textInput} value={amount} onChangeText={setAmount} />
          <Button onPress={createPaymentIntent} title="Create Payment Intent"/>
        </>
      }
      {clientSecret.length > 0 && status === '' &&
        <>
          <Text style={styles.text}>2. Make the payment</Text>
          <Text style={styles.text}>{clientSecret}</Text>
          {isPaySupported && <PlatformPayButton
            type={PlatformPay.ButtonType.Order}
            borderRadius={10}
            style={styles.button}
            onPress={confirmPayment}
          />}
        </>
      }
      { status.length > 0 &&
        <>
          <Text style={styles.text}>3. Result</Text>
          <Text style={styles.text}>Payment Intent ID={JSON.stringify(intentId)}</Text>
          <Text style={styles.text}>{status}</Text>
          <Button onPress={startOver} title="Start Over"/>
        </>
      }
      <Text>isPaySupported={JSON.stringify(isPaySupported)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    height: 45,
    width: '50%',
  },
  textInput: {
    width: '50%',
    height: 40,
    borderWidth: 1,
    borderColor: 'red',
    textAlign: 'center'
  }
});

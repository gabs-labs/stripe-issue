import {
  confirmPlatformPayPayment,
  isPlatformPaySupported,
  PaymentIntent,
  PlatformPay,
  PlatformPayButton
} from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [amount, setAmount] = useState('2000')
  const [clientSecret, setClientSecret] = useState('')
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

    if (paymentIntent.client_secret) {
      setClientSecret(paymentIntent.client_secret)
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
              amount,
              paymentType: PlatformPay.PaymentType.Immediate,
            }
          ],
          merchantCountryCode: "GB",
          currencyCode: "GBP",
        }
      },
    );

    console.log(`>>> ${new Date().toISOString()} >>> paid: error=${error} & status=${paymentIntent?.status}`)

    if (error || paymentIntent?.status !== PaymentIntent.Status.Succeeded) {
      setStatus(`Payment not completed: ${error}, ${paymentIntent?.status}`);
    }

    setStatus(`Payment completed: ${paymentIntent?.status}`)
  };

  const startOver = () => {
    setAmount('2000')
    setClientSecret('')
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
          <Text style={styles.text}>{status}</Text>
          <Button onPress={startOver} title="Start Over"/>
        </>
      }
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
  },
  textInput: {
    width: '50%',
    height: 40,
    borderWidth: 1,
    borderColor: 'red',
    textAlign: 'center'
  }
});

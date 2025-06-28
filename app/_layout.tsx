import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier={process.env.EXPO_PUBLIC_APPLE_MERCHANT_ID}
      >
        <Stack />
      </StripeProvider>
    </GestureHandlerRootView>
  )
}

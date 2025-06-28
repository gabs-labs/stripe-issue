module.exports = () => {
  // const merchantIdentifier = process.env.APPLE_MERCHANT_ID;
  const slug = "stripe-issue"
  const iosBundleIdentifier = `uk.co.gabslabs.${slug}`;

  return {
    name: slug,
    slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "stripeissue",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: iosBundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "@stripe/stripe-react-native",
        {
          // merchantIdentifier,
          enableGooglePay: false
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "0fe4e615-6caa-4a15-80eb-3633945d7e98"//process.env.EAS_PROJECT_ID
      }
    }
  }
}
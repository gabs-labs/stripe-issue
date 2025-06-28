# Instructions

Unfortunately you will have to perform an eas development build to get this thing rolling. You can do it locally or using EAS:
https://docs.expo.dev/develop/development-builds/create-a-build/
For local builds you will need to setup your own local env (for example install `fastlane` etc), this is out of scope of this readme.  

You will need to have a device added to your provisioning profile:  
https://docs.expo.dev/develop/development-builds/create-a-build/#build-the-native-app-ios-device  
https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/

## Prerequisites

1. `npm ci`
2. Go through Stripe setup instructions (you work for stripe- you should do this with your eyes closed :wink:):  
   - https://docs.expo.dev/versions/latest/sdk/stripe/  
   - https://docs.stripe.com/apple-pay?platform=react-native
3. Setup your `.env.local` (use `.env.example` as template)
4. Run `eas build --platform ios --profile development`
5. Install app on your iPhone by scanning QR code

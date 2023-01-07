# Chat APP - React Native

This is a chat app for mobile devices built with React-Native. It provides users with a chat interface where they can send/receive text messages and images as well as share their location.

## Key Features
- A start screen where users can enter their name and choose a background color for the chat screen.
- Users can go to the chat screen from start screen.
- A chat screen displaying the conversation, as well as an input field and submit button.
- The chat provides users with two additional communication features: sending images (picking images from Handy's media libary or taking a photo directly through Handy's camera) and location data.
- Data gets stored online and offline.

# Prerequisites
- Install [Expo](https://expo.dev/): `npm install expo-cli -g`.

- For Windows and Linux: Install [Android Studio](https://developer.android.com/studio).
  For more information how to set up an emulator, look [here](https://docs.expo.dev/workflow/android-studio-emulator/?redirected).

- For Mac: Install [XCode](https://developer.apple.com/xcode/).

- Install the Expo app on your mobile device (available in Google Play Store and Apple Store)

# Getting Started
- To install all the dependencies: `npm i`.

- To start the app: `expo/npm start`.

- Launch app on physical device: scan QR code in Expo GUI

- Launch app on emulator: Press "Run on Android device/emulator in Expo GUI

# Database information
This project uses [Google Firebase/Firestore](https://firebase.google.com/) for data storage.
If you get stuck at any point,check the [Firebase documentation](https://firebase.google.com/docs/web/setup).

# Set up Firestore for your React Native project
1. Sign in, then click on "Go to console" link

2. Choose to start in test mode, so we don't need to create any security rules

3. Install Firestore via Firebase in your project: `npm install firebase`.

4. Import Firestore in your App.js file
```
const firebase = require('firebase');
require('firebase/firestore');
```
5. Back in the Firestore project in your browser, open up "Settings", then "General" tab. Under the section "Your apps" you can generate configurations for different platforms. Here, click "Firestore for Web". Copy the contents of the config object.

6. In your Chat.js file create a constructor in the App class. Here you can paste the data you copied from config object.

## Example
```
firebase.initializeApp({
  apiKey: 'your-api-key',
  authDomain: 'your-authdomain',
  databaseURL: 'your-database-url',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
});
```
Note: You'd need to copy the configuration info from your own Firstore database!

7. Create a reference to the Firestore collection:
`this.referenceMessages = firebase.firestore().collection('chat');`

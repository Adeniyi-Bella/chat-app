//App component to render home page


import React, { Component } from 'react';

// import { StyleSheet, Text, View } from 'react-native';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/start-screen/start';
import Chat from './components/chat-screen/chat';

//returns an object containing two components, Navigator and Screen
const Stack = createStackNavigator();

//class created to render APP
export default class ChatApp extends Component {
  render() {
    
    return (
      //manages the state of the app 
      <NavigationContainer>  
        <Stack.Navigator
          initialRouteName="Start"
        >
          {/* //populating  stack navigator with screns*/}
          {/* Start screen using the imported stack component */}
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
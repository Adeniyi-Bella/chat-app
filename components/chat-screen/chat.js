// class component for the chat screen

// importing neccessary libraries
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import MapView from "react-native-maps";
import CustomActions from "../custom-actions/custom-action";

/**
 * import functions from firebase SDK
 */
const firebase = require("firebase");
require("firebase/firestore");

/**
 * Represents a Chat component
 * @Class Chat - A React class component
 */
export default class Chat extends React.Component {
  constructor() {
    super();
    // creating state values for the component
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        avatar: "",
        name: "",
      },
      loggedInText: "Please wait, you are getting logged in",
      image: null,
      location: null,
      isConnected: false,
    };

    /**
     * Connecting to firebase DB
     * @function firebaseConfig - firebase configuration
     * @param {string} apiKey - firebase apiKey
     * @param {string} authDomain - firebase authDomain
     * @param {string} projectId - firebase projectId
     * @param {string} storageBucket - firebase storageBucket
     * @param {string} messagingSenderId - firebase messagingSenderId
     * @param {string} appId - firebase appId
     * @param {string} measurementId - firebase measurementId
     */

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBP8KR6hL562JeCkbWvfKx-xeeEAfEnD7E",
        authDomain: "test-64e2d.firebaseapp.com",
        projectId: "test-64e2d",
        storageBucket: "test-64e2d.appspot.com",
        messagingSenderId: "456366870794",
        appId: "1:456366870794:web:3967fc1dd3b71273e5eaf3",
        measurementId: "G-B4F3TH6352",
      });
    }

    // reference message collection created in the DB
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  /**
   * @function getMessages
   * @description Get messages locally from user's device
   */

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // When component loads, do ...
  componentDidMount() {
    // Set the name property to be included in the navigation bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // check if user is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");

        // referencing the collection DB
        this.referenceChatMessages = firebase
          .firestore()
          .collection("messages");

        // check if user is signed in. if not create a new user
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            // calling the Firebase Auth service
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            },
            loggedInText: "",
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({ isConnected: false });
        console.log("offline");
        //if user is offline, load message from async storage
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  // when user sends messages i.e click on send, use gifted chat to append the message
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  // add message to DB collection with the referencechatmessage function
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // save data in the app using async storage
  //works the same as local storage and session storage in HTML5
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * @function renderBubble
   * @description - create a renderbubble function that returns a bubble using bubble component
   * @param {object} props - props
   */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#00af80",
          },
          left: {
            backgroundColor: "#e1e1",
          },
        }}
      />
    );
  }

  /**
   * @name renderBubble
   * @description retrieve current data in DB
   * @param {object} props - props
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    // update the state of messages
    this.setState({
      messages,
    });
  };

  //disallow user to send message when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  /**
   * @function renderCustomActions
   * @description - renders the action button by rendering customactions component
   */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  /**
   * @function renderCustomView
   * @description - renders the location map on chat screen
   * @param {object} props - props
   */
  renderCustomView(props) {
    // console.log(props);
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // Set the color property as background color for the chat screen
    let color = this.props.route.params.color;
    return (
      <ActionSheetProvider>
        <View style={[styles.container, { backgroundColor: color }]}>
          <Text>{this.state.loggedInText}</Text>
          <GiftedChat
            // bind the bubble to the messages to be sent
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            onSend={(messages) => this.onSend(messages)}
            renderActions={this.renderCustomActions.bind(this)}
            renderCustomView={this.renderCustomView.bind(this)}
            user={{
              _id: this.state.uid,
              avatar: "https://placeimg.com/140/140/any",
            }}
          />
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

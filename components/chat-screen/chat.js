// Class component for the chat room screen

// Importing neccessary libraries and components
import React from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";

// Creating and exporting chat class components
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      //set state of messages to be displayed 
      messages: [],
    };
  }

  componentDidMount() {
    // Get the name as a prop from start screen component
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    // Set the name as the title of the chat screen above the page
    this.props.navigation.setOptions({ title: name });
    //once component mounts, display new set of messages
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello " + name,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
         },
      ],
    });
  }

  //append new messages to old ones once user sends a new message
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  //set background color of messages sent by other users
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    //retrieve props passed from parent class
    let color = this.props.route.params.color;
    // let name = this.props.route.params.name;
    return (
      <View style = {{flex: 1, backgroundColor: color}}>
        {/* use the gifted chat component to render messages */}
        <GiftedChat
        // Attach bubble to sent messages
        renderBubble={this.renderBubble.bind(this)}
        //set state of message 
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* Avoid KeyboardAvoidingView bug with android app */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

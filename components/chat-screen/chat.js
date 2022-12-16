// Class component for the chat room screen
import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  componentDidMount() {
    // Get the name as a prop from start screen component
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    // Set the name as the title
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    let color = this.props.route.params.color;
    let name = this.props.route.params.name;
    return (
      <View style={[{ flex: 1,justifyContent: 'center', alignItems: 'center' }, { backgroundColor: color }]}>
        <Text>{name}</Text>
      </View>
    );
  }
}

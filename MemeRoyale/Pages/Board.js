import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
  FlatList
} from "react-native";
import {
  Header,
  Button,
  Icon,
  Text,
  ListItem,
  Divider
} from "react-native-elements";
import { defaultStyles } from "./styles";
import { getRoom } from "../API/Rooms";
import {kYMTrending} from "../Objects/kYMTrending"
import Carousel from 'react-native-snap-carousel';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
const styles = StyleSheet.create({
  ...defaultStyles,
  container: {
    display: "flex"
  }
});

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isChooser: false,
      imagesIndex:[],
      selectedImage: null
    };

    this.user = this.props.navigation.getParam("user", null);
    this.room = this.props.navigation.getParam("room", null);
  }



  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
}
 

    componentDidMount() {
    getRoom(this.room.code).then(room => {
      // Check if the room's current meme chooser is this user's email address
      if (room.currentChooser === this.user) {
        this.setState({ isChooser: true });
      }
    });
    
    this.setState({
      imagesIndex : kYMTrending
    })
  }

  handleMemePress = meme => {};

  handleBack = () => {
    this.setState({ index: this.state.index - 1 });
  };

  handleNext = () => {
    this.setState({ index: this.state.index + 1 });
  };

  handleSelectMeme = () => {
    // Handle API select MEME
    this.props.navigation.navigate("CreateMeme", {
      room: this.room,
      user: this.user,
    });
  };
  

  render() {
    const { images, index, isChooser } = this.state;

    // Display the carousel for the person to choose a meme
    
    if (isChooser) {
      return (
        <View style={styles.background}>
          <Text h4 style={styles.textCenter}>
            Select a meme template
          </Text>
          <FlatList
        data = {this.state.imagesIndex}
        keyExtractor={(item) => item.index}
        renderItem={({ item }) => (
          <Card>
          <CardImage source={{uri: item.link}} />
        <CardButton onPress={() => {
          this.setState({selectedImage:item.link})
          console.log(this.state.selectedImage)
          }} title="Select" color="blue"/>
        </Card>
        )}
        />
          <View>
            <Button
              title="Next"
              onPress={this.handleNext}
              buttonStyle={styles.button}
            />
    
          </View>
        </View>
      );
    }

    // Display a loading icon that they should wait until the person has chosen their meme
    else {
      return (
        <View>
          <Text style={styles.textCenter}>
            Please wait until everyone has submitted their caption
          </Text>
          <ActivityIndicator style={styles.loading} />
        </View>
      );
    }
  }
}

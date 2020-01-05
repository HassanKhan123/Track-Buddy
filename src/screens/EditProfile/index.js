import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

class EditProfile extends Component {
  state = {
    userName: "",
    userImage: "",
    loading: false
  };
  componentDidMount() {
    // console.log(this.props)
    this.setState({
      userName: this.props.name,
      userImage: this.props.picture
    });
    this.getPermissionAsync();
    console.log(this.state);
  }
  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  _pickImage = async () => {
    console.log("image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ userImage: result.uri });
    }
  };

  save = async () => {
    console.log(this.state);
    this.setState({ loading: true });
    await firebase
      .firestore()
      .collection("users")
      .doc(this.props.id)
      .set(
        {
          profilePicture: this.state.userImage,
          name: this.state.userName
        },
        {
          merge: true
        }
      );
    this.setState({ loading: false });
    this.props.editing(this.state.userName, this.state.userImage);
    this.props.navigation.navigate("Home");
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });

    this.props.navigation.navigate("Auth");
    this.props.loggingOut();
  };

  render() {
    const { userImage, userName } = this.state;
    console.log("Image=>", userImage);
    console.log("Name=> ", userName);
    return (
      <ScrollView>
        <View style={styles.container}>
          {userImage ? (
            <TouchableOpacity onPress={this._pickImage}>
              <Image source={{ uri: userImage }} style={styles.image} />
            </TouchableOpacity>
          ) : null}

          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={text => this.setState({ userName: text })}
          />

          <TouchableOpacity style={styles.btn} onPress={this.save}>
            <View>
              <Text style={styles.btnText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={this.logout}>
            <View>
              <Text style={styles.btnText}>Logout</Text>
            </View>
          </TouchableOpacity>

         
          {this.state.loading ? (
            <Image
              source={require("../../../assets/loading.gif")}
              style={styles.loading}
            />
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 1
  },
  input: {
    margin: 15,
    borderColor: "black",
    borderWidth: 1,
    width: 200,
    height: 40,
    borderRadius: 20,
    padding: 10
  },
  btnText: {
    fontSize: 20,
    marginTop: -10,
    color: "white"
  },
  btn: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "green",
    borderRadius: 15
  },
  loading: {
    height: 60,
    width: 60
  }
});

const mapStateToProps = state => {
  return {
    id: state.userReducer.userID,
    name: state.userReducer.userName,
    picture: state.userReducer.userPicture,
    fname: state.userReducer.userFname,
    lname: state.userReducer.userLname
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loggingOut: () => dispatch({ type: "LOGGING_OUT" }),
    editing: (name, picture) =>
      dispatch({
        type: "EDITING",
        data: {
          name,
          picture
        }
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

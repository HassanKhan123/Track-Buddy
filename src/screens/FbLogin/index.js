import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight
} from "react-native";
import Facebook from "../../facebook-login/fb-login";
import { connect } from "react-redux";
import { Entypo, Feather } from "@expo/vector-icons";
import { Notifications } from "expo";

class FbLogin extends Component {
  state = {
    loading: false,
    token: ""
  };

  async componentDidMount() {
    if (this.props.isUser) {
      this.props.navigation.navigate("Home");
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log("token=> ", token);
    this.setState({ token });
  }

  login = async () => {
    this.setState({ loading: true });
    try {
      const res = await Facebook.loginWithFacebook(this.state.token);
      console.log(res);
      this.setState({ loading: false });
      res.circles
        ? this.props.login(
          res.deviceToken,
            res.uid,
            res.name,
            res.profilePicture,
            res.firstName,
            res.lastName,
            res.circles,
          )
        : this.props.login(
          res.deviceToken,
            res.uid,
            res.name,
            res.profilePicture,
            res.firstName,
            res.lastName,
          );
      console.log(this.props.id);
      this.props.navigation.navigate("Home");
    } catch (e) {
      alert(e.message);
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../../../assets/logo.png")} />
        <Text style={styles.text}>Track Buddy</Text>
        <TouchableOpacity onPress={this.login} style={styles.btn}>
          <View>
            <Text style={styles.btnText}>Sign In with Facebook</Text>
          </View>
        </TouchableOpacity>

        {this.state.loading ? (
          <Image
            source={require("../../../assets/loading.gif")}
            style={styles.loading}
          />
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  iconStyle: {
    fontSize: 30,
    width: 40,
    margin: 20
  },
  text: {
    fontSize: 24,
    marginVertical: 10
  },
  btnText: {
    fontSize: 20,
    marginTop: -10,
    color: "white"
  },
  btn: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#0d47a1",
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
    isUser: state.userReducer.isUser,
    token: state.userReducer.deviceToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (token,id, name, picture, fname, lname, circles) =>
      dispatch({
        type: "LOGGING_IN",
        data: {token, id, name, picture, fname, lname, circles}
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FbLogin);

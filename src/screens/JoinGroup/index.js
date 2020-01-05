import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  YellowBox
} from "react-native";
import { connect } from "react-redux";
import * as firebase from "firebase";

class JoinGroup extends Component {
  constructor() {
    super();
    YellowBox.ignoreWarnings(["Setting a timer"]);
  }
  state = {
    loading: false,
    joinCode: "",
    circles: [],
    codeFound: false,
    matchedCircle: []
  };

  join = async () => {
    this.setState({ loading: true });

    try {
      const getUserInfo = await firebase
        .firestore()
        .collection("users")
        .doc(this.props.id)
        .get();

      const getLatitude = getUserInfo.data().latitude;
      const getLongitude = getUserInfo.data().longitude;

      await firebase
        .firestore()
        .collection("users")
        .get()
        .then(doc => {
          doc.docs.forEach(data => {
            if (data.data().circles) {
              // if (data.data().circles.length === 1) {
              //   this.setState({
              //     circles: [data.data().circles]
              //   });
              // }
              // else{
              data.data().circles.map(circle => {
                console.log(circle);
                this.setState({ circles: [...this.state.circles, circle] });
              });
              // }
            }
          });
        });

      console.log("state => ", this.state.circles);

      const newCircle = this.state.circles.map(circle => {
        // console.log('circle => ',circle)
        if (circle.groupCode == this.state.joinCode) {
          circle.groupUsers.push({
            id: this.props.id,
            latitude: getLatitude,
            longitude: getLongitude,
            name: this.props.name,
            deviceToken: this.props.deviceToken
          });
          this.setState({ matchedCircle: circle });
          return circle;
        }
        return false;
      });

      console.log(this.state.matchedCircle);
      console.log(this.state.matchedCircle.groupUsers[0].id);

      const getPrevCircles = await firebase
        .firestore()
        .collection("users")
        .doc(this.state.matchedCircle.groupUsers[0].id)
        .get();
      const getCir = getPrevCircles.data();
      console.log("GetCir=> ", getCir.circles);

      const newArr = getCir.circles.filter(
        c => c.groupCode != this.state.joinCode
      );

      console.log("New Arr => ", newArr);

      await firebase
        .firestore()
        .collection("users")
        .doc(this.state.matchedCircle.groupUsers[0].id)
        .set(
          {
            circles: [...newArr, this.state.matchedCircle]
          },
          { merge: true }
        );

      const arr = this.state.matchedCircle;
      console.log(arr);
      const first = arr.groupUsers.shift();
      arr.groupUsers.push(first);
      console.log(arr);
      const user = await firebase
        .firestore()
        .collection("users")
        .doc(this.props.id)
        .get();
      user.data().circles
        ? await firebase
            .firestore()
            .collection("users")
            .doc(this.props.id)
            .set(
              {
                circles: [...user.data().circles, arr]
              },
              { merge: true }
            )
        : await firebase
            .firestore()
            .collection("users")
            .doc(this.props.id)
            .set(
              {
                circles: firebase.firestore.FieldValue.arrayUnion(
                  arr
                )
              },
              { merge: true }
            );

      console.log(user.data().circles);
      this.props.create(this.state.matchedCircle);

      this.setState({ loading: false,joinCode:''});
      alert('Successfull joined')
    } catch (e) {
      this.setState({ loading: false,joinCode:''});
      alert('Invalid Code')
    }
  };

  render() {
    const { joinCode } = this.state;
    return (
      <View>
        <Text style={{ fontSize: 20, margin: 20 }}>
          {" "}
          Enter your circle code to join{" "}
        </Text>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={joinCode}
            onChangeText={text => this.setState({ joinCode: text })}
          />
          <TouchableOpacity style={styles.btn} onPress={this.join}>
            <View>
              <Text style={styles.btnText}>Join</Text>
            </View>
          </TouchableOpacity>
          {this.state.loading ? (
            <Image
              source={require("../../../assets/loading.gif")}
              style={styles.loading}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
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
    marginTop: -15,
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
    circles: state.userReducer.circles,
    name: state.userReducer.userName,
    deviceToken: state.userReducer.deviceToken
  };
};
const mapDispatchToProps = dispatch => {
  return {
    create: circle =>
      dispatch({
        type: "CREATING_CIRCLE",
        data: {
          circle
        }
      })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JoinGroup);

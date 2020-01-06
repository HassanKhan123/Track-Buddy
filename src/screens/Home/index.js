import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import { connect } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapView, { Marker } from "react-native-maps";
import * as firebase from "firebase";
import { Button } from "native-base";
import { Notifications } from "expo";

class Home extends Component {
  state = {
    location: null,
    errorMessage: null,
    latitude: null,
    longitude: null,
    selectedGroup: "",
    circles: [],
    availableCircles: [],
    matchCircle: [],
    users: []
  };

  async componentDidMount() {
    this._getLocationAsync();
    
    //   const token = await Notifications.getExpoPushTokenAsync();
   
    // console.log(this.state.availableCircles);
    // const getCircles = await firebase
    //   .firestore()
    //   .collection("users")
    //   .doc(this.props.id)
    //   .get();
    //   // console.log(getCircles.data())
    // const circles = getCircles.data().circles;
    // // console.log(circles);
    // circles.length?circles.map(circle=>{
    //   this.setState({
    //     circles:[...this.state.circles,circle.groupName]
    //   })
    // }):'';
  }

  sendNotify = () => {
    const userArr = this.state.users;
    const remFirst = userArr.shift();
    console.log(userArr)
    userArr.map(user=>{
      console.log(user.deviceToken);
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
              Accept: 'application/json',
             'Content-Type': 'application/json',
             'accept-encoding': 'gzip, deflate',
             'host': 'exp.host'
         },
       body: JSON.stringify({
             to: user.deviceToken,
             title: 'I am in Danger',
             body: `Please Help me ${this.props.name} here`,
             priority: "high",
             sound:"default",
             channelId:"default",
                 }),
     }).then((response) => response.json())
              .then((responseJson) => {  })
                     .catch((error) => { console.log(error) });
    })
  }

  getCirclesUsers = async (value, index) => {
    const getAvailableCircles = await firebase
      .firestore()
      .collection("users")
      .doc(this.props.id)
      .get();

    getAvailableCircles.data().circles
      ? this.setState({ availableCircles: [...this.state.availableCircles,getAvailableCircles.data().circles] })
      : this.setState({ availableCircles: [] });

    this.setState({ selectedGroup: value, users: [] });
    console.log("Available => ",this.state.availableCircles)
    this.state.availableCircles.map(circle => {
      return circle.map(c=>{
        if (c.groupName === this.state.selectedGroup) {
          this.setState({ matchCircle: c });
          this.state.matchCircle.groupUsers.map(user => {
            return this.setState({ users: [...this.state.users, user] });
          });
        }
        console.log("users => ", this.state.users);
        return c;
      })
     
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
      alert("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location);
    this.setState({
      location,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });

    firebase
      .firestore()
      .collection("users")
      .doc(this.props.id)
      .set(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        {
          merge: true
        }
      );
  };

  render() {
    // console.log('circles=> ',this.props.circles)
    console.log("circles =>", this.props.circles);
    const data = this.props.circles
      ? this.props.circles.map(circle => {
          return { value: circle.groupName };
        })
      : [];

    // const data =['hassan']

    return (
      <View>
        <StatusBar backgroundColor="green" barStyle="light-content" />
        {this.state.location ? (
          <View style={{position:'absolute'}}>
            <View style={{alignSelf:'center',width:200}}>
            <Dropdown
              onChangeText={this.getCirclesUsers}
              value={this.state.selectedGroup}
              label="Your Groups"
              data={data}
              style={{position:'relative'}}
            />
            </View>
            <MapView 
              style={styles.mapStyle}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            >
              {this.state.users.length > 0 ? (
                this.state.users.map(user => (
                  <MapView.Marker
                    coordinate={{
                      latitude: user.latitude,
                      longitude: user.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                    }}
                    title={user.name}
                  />
                ))
              ) : (
                <Marker
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                />
              )}
            </MapView>

            {this.state.selectedGroup ? (
              <TouchableOpacity style={styles.btn} onPress={this.sendNotify}>
                <View>
                  <Text style={styles.btnText}>I am in danger</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View>
            <Text>{this.state.errorMessage}</Text>
            <MapView style={styles.mapStyle} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
   
  },
  btnText: {
    fontSize: 20,
    marginTop: -5,
    color: "white",
    textAlign: "center"
  },
  btn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 15,
    width: 200,
    position:'absolute',
    top:"65%",
    alignSelf:'center'
    
  }
});

const mapStateToProps = state => {
  return {
    id: state.userReducer.userID,
    name:state.userReducer.userName,
    circles: state.userReducer.circles
  };
};

export default connect(mapStateToProps, {})(Home);

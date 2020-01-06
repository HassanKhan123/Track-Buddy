import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import * as firebase from "firebase";

class CreateGroup extends Component {
  state = {
    groupName: "",
    loading: false
  };
  createGroup = async () => {
    this.setState({ loading: true });
    if (!this.state.groupName) {
      this.setState({ loading: false });
      alert("Please enter group name");
    } else {
      const getUserData = await firebase.firestore().collection('users').doc(this.props.id).get();
      const getGroupUser = getUserData.data();
      const getGroupCircles = getUserData.data().circles

      console.log(getGroupUser)
      // console.log(this.state.groupName);
      const obj = {
        groupName:this.state.groupName,
        groupCode: Math.floor(100000 + Math.random() * 900000),
        groupUsers:[{
          name:getGroupUser.firstName,
          id:getGroupUser.uid,
          latitude:getGroupUser.latitude,
          longitude:getGroupUser.longitude,
          deviceToken:getGroupUser.deviceToken
        }]
      }

      getGroupCircles?getGroupCircles.push(obj):[]
      console.log(getGroupCircles)

      getGroupCircles?await firebase
      .firestore()
      .collection("users")
      .doc(this.props.id)
      .set(
        {
          circles: getGroupCircles
          
        },
        {
          merge: true
        }
      ):
      await firebase
        .firestore()
        .collection("users")
        .doc(this.props.id)
        .set(
          {
            circles: firebase.firestore.FieldValue.arrayUnion(
              obj
            )
          },
          {
            merge: true
          }
        );
        this.props.create(obj)
        this.setState({loading:false,groupName:''})
    }
  };
  render() {
    const { groupName } = this.state;
    return (
      <View style={styles.container}>
        <Image source={require('../../../assets/create.png')}/>
        <Text style={{fontSize:24,marginVertical:20}}>Create Group</Text>
        <TextInput
          style={styles.input}
          value={groupName}
          onChangeText={text => this.setState({ groupName: text })}
          defaultValue="Enter Group Name"
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={this.createGroup}
        >
          <View>
            <Text style={styles.btnText}>Create</Text>
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
    marginTop: -5,
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
    id: state.userReducer.userID
  };
};

const mapDispatchToProps = dispatch => {
  return{
    create:(circle) => dispatch({type:'CREATING_CIRCLE',data:{
      circle
    }})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateGroup);

import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import { connect } from "react-redux";
import * as SMS from "expo-sms";

class InviteUsers extends Component {
  state = {
    selectedGroup: "",
    selectedGroupCode: null,
    phoneNumber: "",
    loading: false
  };

  invite = async () => {
    this.setState({loading:true})
    const { selectedGroup, selectedGroupCode, phoneNumber } = this.state;
    if (!selectedGroup || !selectedGroupCode || !phoneNumber) {
        this.setState({loading:false})
      alert("Please fill all the fields");
      return;
    }
    console.log(`Sender Name : ${this.props.name}`);
    console.log(`Group Name : ${selectedGroup}`);
    console.log(`Group Code : ${selectedGroupCode}`);
    console.log(`Phone Number : ${phoneNumber}`);

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        phoneNumber,
        `${this.props.name} invited you to join ${selectedGroup}. Please enter ${selectedGroupCode} this code in join group page.`
      );
      console.log(result);
      this.setState({loading:false,phoneNumber:''})
    } else {
        this.setState({loading:false})
      alert("there's no SMS available on this device");
      // misfortune... there's no SMS available on this device
    }
  };

  render() {
    const { phoneNumber } = this.state;
    console.log("circles=> ", this.props.circles);
    const data = this.props.circles
      ? this.props.circles.map(circle => {
          return { value: circle.groupName, code: circle.groupCode };
        })
      : [];
    // const data = []
    return (
      <View>
        <Text style={{fontSize:20,margin:20}}> Enter Phone Number To Send Invite </Text>
        <Text style={{fontSize:18,marginHorizontal:20}}>Your Available Groups</Text>
        <Dropdown
          onChangeText={(value, index) => {
            this.setState({
              selectedGroup: value,
              selectedGroupCode: data[index].code
            });
            console.log(data[index].code);
          }}
          value={this.state.selectedGroup}
          label="Your Groups"
          data={data}
        />
        <Text style={{fontSize:18,marginHorizontal:20}}>Group Code: {this.state.selectedGroupCode}</Text>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            defaultValue="Enter Phone Number"
            value={phoneNumber}
            onChangeText={text => this.setState({ phoneNumber: text })}
          />
          <TouchableOpacity style={styles.btn} onPress={this.invite}>
            <View>
              <Text style={styles.btnText}>Invite</Text>
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
    name: state.userReducer.userName
  };
};

export default connect(mapStateToProps, {})(InviteUsers);

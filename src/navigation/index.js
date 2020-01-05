import React,{Component} from 'react'
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import Home from '../screens/Home'
import FbLogin from '../screens/FbLogin'
import CreateGroup from '../screens/CreateGroup'
import InviteUsers from '../screens/InviteUsers'
import EditProfile from '../screens/EditProfile'
import JoinGroup from '../screens/JoinGroup'
import {AntDesign,MaterialIcons,FontAwesome} from "@expo/vector-icons"

const AppStack= createMaterialTopTabNavigator({
    Home:{
        screen:Home,
        navigationOptions:{
            tabBarLabe:'',       
            tabBarIcon: ({ tintColor }) => (
                <AntDesign name="home" size={25}  />
              )
        }
    },
    CreateGroup:{
        screen:CreateGroup,
        navigationOptions:{
            tabBarLabel:'',
            tabBarIcon: ({ tintColor }) => (
                <AntDesign name="addusergroup" size={25}  />
              )
        }
    },
    InviteUsers:{
        screen:InviteUsers,
        navigationOptions:{
            tabBarLabel:'',
            tabBarIcon: ({ tintColor }) => (
                <MaterialIcons name="insert-invitation" size={25}  />
              )
        }
    },
    JoinGroup:{
        screen:JoinGroup,
        navigationOptions:{
            tabBarLabel:'',
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="group" size={25}  />
              )
        }
    },
    EditProfile:{
        screen:EditProfile,
        navigationOptions:{
            tabBarLabel:'',
            tabBarIcon: ({ tintColor }) => (
                <AntDesign name="edit" size={25}  />
              )
        }
    }
}, {
    
    tabBarOptions: {
        
      activeTintColor: 'red',
      inactiveTintColor: 'black',
      pressColor:'white',
      pressOpacity:'0.5',
      showIcon: true,
      showLabel:false,
      tabStyle:{
          backgroundColor:'green',
          padding:30
      }
      
    }
})
const AuthStack = createStackNavigator({
    Login:FbLogin
})

const navigator = createSwitchNavigator({
    Auth:AuthStack,
    Home:AppStack
},{
    initialRouteName:'Auth',
    
   
})

export default createAppContainer(navigator)
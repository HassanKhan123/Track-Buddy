const initialState = {
  deviceToken:"",  
  userID: "",
  userName: "",
  userPicture: "",
  userFname: "",
  userLname: "",
  circles: [],
  circle:'',
  isUser: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGGING_IN":
      return {
        ...state,
        deviceToken:action.data.token,
        userID: action.data.id,
        userName: action.data.name,
        userPicture: action.data.picture,
        userFname: action.data.fname,
        userLname: action.data.lname,
        circles: action.data.circles,
        isUser: true,
      };
    case "CREATING_CIRCLE":
      console.log(state.circles);
      if(state.circles == undefined){
        console.log('undefined');
        return{
          ...state,
          // circle:action.data.circle,
          circles:[action.data.circle]
        }
      }
      return{
        ...state,
          circles:[...state.circles,action.data.circle]
      }
     
      
     
       
     
     
     
    case "LOGGING_OUT":
      return {
        ...state,
        userID: "",
        userName: "",
        userPicture: "",
        userFname: "",
        userLname: "",
        circles: [],
        isUser: false,
      };
    case 'EDITING':
      return{
        ...state,
        userName:action.data.name,
        userPicture:action.data.picture
      }
    default:
      return state;
  }
};

export default reducer;

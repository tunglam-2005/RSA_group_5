let usloggined = "";
if (localStorage.getItem("loggined")) {
    usloggined = JSON.parse(localStorage.getItem("loggined"));
}
const initialState = {
    
    loggined: usloggined,
}

export const logginedReducer = (state = initialState, action) => {
  switch (action.type) {

  case "LOGGINED_SUCCESS" : {
    return {...state, loggined: action.loggined}
  }

  case "LOGGINED_FAILED": {
    return {...state, loggined: action.loggined}
  }

  default:
    return state
  }
}

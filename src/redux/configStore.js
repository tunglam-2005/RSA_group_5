import { combineReducers, createStore } from "redux";
import { logginedReducer } from "./logginedReducer";
import { ModalReducer } from "./ModalReducer";



const rootReducer = combineReducers({
    logginedReducer,
    ModalReducer,
})

const store = createStore(rootReducer);

export default store;

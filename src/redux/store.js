import { createStore, applyMiddleware } from "redux";

import rootReducer from "../redux/reducer/rootReducer";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

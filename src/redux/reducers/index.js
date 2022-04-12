import { combineReducers } from "redux";
import config from "./config";
import { STATISTICS, CHANGE_WALLET, SELECT_CHAIN } from "../constants";

export function statistics(state = {}, action) {
    switch (action.type) {
        case STATISTICS:
            return action.payload
        default:
            return state
    }
}

export function walletAddress(state = '', action) {
    switch (action.type) {
        case CHANGE_WALLET:
            return {
                address: action.payload
            }
        default:
            return state
    }

    // return state;
}

export function selectedChain(state = 'ropsten', action) {
    switch (action.type) {
        case SELECT_CHAIN:
            return action.payload
        default:
            return state
    }    
}

const rootReducer = combineReducers({
    config,
    statistics,
    walletAddress,
    selectedChain
});
export default rootReducer;

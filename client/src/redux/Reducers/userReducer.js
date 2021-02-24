
import { userActionTypes } from '../Constants/userConstants';

const initState = {
    isLoading: true,
    currentUser: null,
    isAuthenticated: false,
    authError: {
        signInError: "",
        signUpError: "",
        signOutError: '',
        loadUserError: ''
    }
}

const userReducer = (state = initState, { type, payload }) => {

    switch (type) {
        case userActionTypes.LOG_IN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                currentUser: payload
            };
        case userActionTypes.LOG_IN_FAIL:
            return {
                ...state,
                isLoading: false,
                authError: {
                    signInError: payload
                }
            }
        case userActionTypes.SIGN_UP_SUCESS:
            return {
                ...state,
                isLoading: false,
            };
        case userActionTypes.SIGN_UP_FAIL:
            return {
                ...state,
                isLoading: false,
                authError: {
                    signUpError: payload
                }
            };
        case userActionTypes.LOG_OUT_FAIL:
            return {
                ...state,
                isLoading: false,
                authError: {
                    signOutError: payload
                }
            };
        case userActionTypes.LOG_IN_SUCCESS:
            return {
                ...state,
                isLoading: false,
            }

        default:
            return state;
    }
};

export default userReducer;
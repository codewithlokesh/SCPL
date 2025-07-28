// Importing necessary modules and components
import { createSlice } from "@reduxjs/toolkit";
// import { removeLocalStorageToken } from "../../utils/common.utils";
import logger from "../../utils/logger";

// import moduleRoutesMap from "routeControl";
// import { removeLocalStorageToken } from "utils";
// import logger from "utils/logger";

// Creating a slice for managing authentication-related state in Redux
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userAuthdata: {},
  },
  reducers: {
    userLoginAuthdata: (state, action) => ({
      ...state,
      userAuthdata: { ...action.payload },
    }),
    updateSuperAdminDataAction: (state, action) => {
      // return (state = {
      //   ...state,
      //   superAdminAuth: { ...action.payload },
      // });
    },
  },
});

export const {
  userLoginAuthdata,
  updateSuperAdminDataAction,
} = authSlice.actions;

export const updateUserAuthdataLogin = (data) => async (dispatch) => {
  try {
    dispatch(userLoginAuthdata(data));
  } catch (error) {
    logger(error);
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    // removeLocalStorageToken();
    // localStorage.clear();
    // dispatch(logoutSuperAdminAction());
    // navigate("/login");
  } catch (error) {
    logger(error);
  }
};

// Handle sidebar key update

// Selectors for retrieving specific pieces of state
export const getUserAuthData = (state) => state.auth.userAuthdata;

export default authSlice.reducer;

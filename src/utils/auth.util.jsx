import { getLocalStorageToken } from "./common.utils";
/** ****Function is driver function for authenticate*******
 * ****user and route for which it will**************
 * ****return true and false************************** */

function authDriver(route, userData) {
  // pathname
  try {
    let checkData = getLocalStorageToken();
    let user = "";

    let userCheck =
      Array.isArray(userData?.UserRoles) && userData.UserRoles.length > 0
        ? userData.UserRoles[0].Role?.name
        : user;
    if (
      ["Admin", "SubAdmin", "University", "Student", "Coach"].includes(
        userCheck
      ) &&
      route?.private
    ) {
      return true;
    } else if (route.private && userCheck === user) {
      // ********For secure route**************
      if (checkData) {
        return true;
      } else {
        return false;
      }
    } else {
      // **Non secure route****
      if (checkData) {
        return false;
      }
      if (route.private === false) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    console.log("error", err);
    return false;
  }
}

export default authDriver;

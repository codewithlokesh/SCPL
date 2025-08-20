import axios from "axios";
import momentTimezone from "moment-timezone";
import {
  getLocalStorageToken,
  removeLocalStorageToken,
  removeSessionStorageToken,
} from "../utils/common.utils";
import { API_BASE_URL } from "../config";
import logger from "../utils/logger";
import store, { Persistor } from "../store";
import { logoutSuperAdminAction } from "../redux/AuthSlice/index.slice";
import { toast } from "react-toastify";
const APIrequest = async ({
  method,
  url,
  baseURL,
  queryParams,
  bodyData,
  cancelFunction,
  formHeaders,
  removeHeaders,
}) => {
  const apiToken = getLocalStorageToken();

  try {
    const axiosConfig = {
      method: method || "GET",
      baseURL: API_BASE_URL,
      headers: {
        "content-type": "application/json",
        "X-Frame-Options": "sameorigin",
        timezone: momentTimezone.tz.guess(true),
      },
    };

    if (formHeaders) {
      axiosConfig.headers = { ...axiosConfig.headers, ...formHeaders };
    }

    if (baseURL) {
      axiosConfig.baseURL = baseURL;
    }

    if (url) {
      axiosConfig.url = url;
    }

    if (queryParams) {
      const queryParamsPayload = {};
      for (const key in queryParams) {
        if (Object.hasOwnProperty.call(queryParams, key)) {
          let element = queryParams[key];
          if (typeof element === "string") {
            element = element.trim();
          }
          if (!["", null, undefined, NaN].includes(element)) {
            queryParamsPayload[key] = element;
          }
        }
      }
      axiosConfig.params = queryParamsPayload;
    }

    if (bodyData) {
      // Check if bodyData is FormData
      if (bodyData instanceof FormData) {
        axiosConfig.data = bodyData;
        // Remove content-type header to let browser set it with boundary for FormData
        delete axiosConfig.headers['content-type'];
      } else {
        const bodyPayload = {};
        for (const key in bodyData) {
          if (Object.hasOwnProperty.call(bodyData, key)) {
            let element = bodyData[key];
            if (typeof element === "string") {
              element = element.trim();
            }
            if (![null, undefined, NaN].includes(element)) {
              bodyPayload[key] = element;
            }
          }
        }
        axiosConfig.data = bodyPayload;
      }
    }

    if (cancelFunction) {
      axiosConfig.cancelToken = new axios.CancelToken((cancel) => {
        cancelFunction(cancel);
      });
    }

    if (removeHeaders) {
      delete axiosConfig.headers;
    }

    if (apiToken) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        // "x-csrf-token": `Bearer ${apiToken}`,
        Authorization: `Bearer ${apiToken}`,
      };
    }

    const res = await axios(axiosConfig);
    return res.data;
  } catch (error) {
    // if (error.response.status === 500) {
    //   console.log("Error message", error.response);
    //   return error.response.data ||;
    // }

    // Handle different error scenarios.
    if (axios.isCancel(error)) {
      logger("API canceled", error);
      throw new Error(error);
    } else {
      // Handle different HTTP status codes and provide appropriate notifications.
      const errorRes = error.response;
      logger("Error in the api request", errorRes);
      // if (errorRes && errorRes.data.statusCode && errorRes.data.statusCode === 403) {
      //   /** *Update permission***** */
      //   // store.dispatch(loadPermission({}, true));
      // }
      if (
        errorRes &&
        errorRes.data.statusCode &&
        errorRes.data.statusCode === 500
      ) {
        if (errorRes.data.message) {
          toast.error(errorRes.data.message);
        }
        return errorRes.data;
      }
      if (
        errorRes &&
        errorRes.data.statusCode &&
        errorRes.data.statusCode === 400
      ) {
        if (errorRes.data.message) {
          toast.error(errorRes.data.message);
        }
        if (
          errorRes &&
          errorRes.data.statusCode &&
          errorRes.data.statusCode === 401
        ) {
          // toast.error(errorRes.data.message);
          let path = "/login";
          window.location.reload(path);
          removeLocalStorageToken();
          removeSessionStorageToken();
        }
      } else {
        // modalNotification({
        //   type: "warning",
        //   message: errorRes?.data?.error[0]?.message || "Not Found",
        // });
      }
      if (
        "errors" in errorRes.data &&
        // Object.keys(errorRes.data.errors).length &&
        [401].includes(errorRes.data.statusCode)
      ) {
        // toast.error(errorRes.data.message);
        removeSessionStorageToken();
        removeLocalStorageToken();
        Persistor?.purge?.();
        store.dispatch(logoutSuperAdminAction());
        let path = "/login";
        window.location.reload(path);
      }
      if (
        errorRes &&
        errorRes.data.statusCode &&
        errorRes.data.statusCode === 401
      ) {
        toast.error(errorRes.data.message);
        if ([401].includes(errorRes.data.statusCode)) {
          removeLocalStorageToken();
          removeSessionStorageToken();
          Persistor?.purge?.();
          store.dispatch(logoutSuperAdminAction());
        }
      }
      if (errorRes && errorRes.status && errorRes.status === 429) {
        // modalNotification({
        //   type: "error",
        //   message: errorRes.data.message || errorRes.data.error.description,
        // });
      }
      if (errorRes?.data?.message) {
        // modalNotification({
        //   type: "error",
        //   message: errorRes?.data?.message,
        // });
      } else if (errorRes?.data?.error?.length > 0 && errorRes?.data?.error) {
        // modalNotification({
        //   type: "error",
        //   message: errorRes?.data?.error[0]?.message,
        // });
      }
      return null;
    }
  }
};

export default APIrequest;

import { AuthEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const AuthServices = {
    Login: async (bodyData) => {
        try {
            const payload = {
                ...AuthEndpoints.Login(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
}
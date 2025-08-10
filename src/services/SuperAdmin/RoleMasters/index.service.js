import { AdminRoleMastersEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminRoleMastersServices = {
    getMasters: async () => {
        try {
            const payload = {
                ...AdminRoleMastersEndpoints.GetRoleMasters,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addRoleMasters: async (bodyData) => {
        try {
            const payload = {
                ...AdminRoleMastersEndpoints.RoleMastersCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateRoleMasters: async (bodyData) => {
        try {
            const payload = {
                ...AdminRoleMastersEndpoints.RoleMastersUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteRoleMasters: async (bodyData) => {
        try {
            const payload = {
                ...AdminRoleMastersEndpoints.RoleMastersDelete(bodyData),
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
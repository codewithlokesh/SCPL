import { AdminAccountGroupHeadEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminAccountGroupHeadServices = {
    getAccountGroupHeads: async () => {
        try {
            const payload = {
                ...AdminAccountGroupHeadEndpoints.GetAccountGroupHeads,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getAccountMasterCategory: async () => {
        try {
            const payload = {
                ...AdminAccountGroupHeadEndpoints.GetAccountMasterCategory,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addAccountGroupHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminAccountGroupHeadEndpoints.AccountGroupHeadCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateAccountGroupHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminAccountGroupHeadEndpoints.AccountGroupHeadUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteAccountGroupHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminAccountGroupHeadEndpoints.AccountGroupHeadDelete(bodyData),
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
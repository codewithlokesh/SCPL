import { AdminAccountHeadEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminAccountHeadServices = {
    getAccountHeads: async () => {
        try {
            const payload = {
                ...AdminAccountHeadEndpoints.GetAccountHeads,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getTransactionType: async () => {
        try {
            const payload = {
                ...AdminAccountHeadEndpoints.GetTransactionType,
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
                ...AdminAccountHeadEndpoints.GetAccountMasterCategory,
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
                ...AdminAccountHeadEndpoints.AccountHeadCreate(bodyData),
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
                ...AdminAccountHeadEndpoints.AccountHeadUpdate(bodyData),
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
                ...AdminAccountHeadEndpoints.AccountHeadDelete(bodyData),
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
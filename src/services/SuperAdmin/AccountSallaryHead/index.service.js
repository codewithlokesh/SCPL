import { AdminSallaryHeadEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminSallaryHeadServices = {
    getSallaryHeads: async () => {
        try {
            const payload = {
                ...AdminSallaryHeadEndpoints.GetSallaryHeads,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getSallaryHeadById: async (bodyData) => {
        try {
            const payload = {
                ...AdminSallaryHeadEndpoints.GetSallaryHeadById,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addSallaryHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminSallaryHeadEndpoints.SallaryHeadCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateSallaryHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminSallaryHeadEndpoints.SallaryHeadUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteSallaryHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminSallaryHeadEndpoints.SallaryHeadDelete(bodyData),
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
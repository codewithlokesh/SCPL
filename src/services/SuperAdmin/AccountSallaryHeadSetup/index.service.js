import { AdminSallaryHeadEndpoints, AdminSallaryHeadSetupEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminSallaryHeadSetupServices = {
    getSallaryHeadsSetup: async () => {
        try {
            const payload = {
                ...AdminSallaryHeadSetupEndpoints.GetSallaryHeadSetups,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getSallaryHeadSetupById: async (bodyData) => {
        try {
            const payload = {
                ...AdminSallaryHeadSetupEndpoints.GetSallaryHeadSetupById(bodyData),
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
                ...AdminSallaryHeadSetupEndpoints.SallaryHeadSetupCreate(bodyData),
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
                ...AdminSallaryHeadSetupEndpoints.SallaryHeadSetupSetupUpdate(bodyData),
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
                ...AdminSallaryHeadSetupEndpoints.SallaryHeadSetupDelete(bodyData),
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
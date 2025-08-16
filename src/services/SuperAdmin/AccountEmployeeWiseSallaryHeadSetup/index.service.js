import { AdminEmployeeWiseSallaryHeadEndpoints, AdminSallaryHeadEndpoints, AdminSallaryHeadSetupEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminEmployeeWiseSallaryHeadServices = {
    getEmployeeWiseSallaryHeadsSetup: async () => {
        try {
            const payload = {
                ...AdminEmployeeWiseSallaryHeadEndpoints.GetEmployeeWiseSallaryHeadSetups,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getEmployeeWiseSallaryHeadSetupById: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeWiseSallaryHeadEndpoints.GetEmployeeWiseSallaryHeadSetupById(bodyData),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addEmployeeWiseSallaryHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeWiseSallaryHeadEndpoints.EmployeeWiseSallaryHeadSetupCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateEmployeeWiseSallaryHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeWiseSallaryHeadEndpoints.EmployeeWiseSallaryHeadSetupUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteEmployeeWiseSallaryHead: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeWiseSallaryHeadEndpoints.EmployeeWiseSallaryHeadSetupDelete(bodyData),
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
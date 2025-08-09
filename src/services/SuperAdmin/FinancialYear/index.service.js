import { AdminFinancialYearEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminFinancialYearServices = {
    getFinancialYears: async () => {
        try {
            const payload = {
                ...AdminFinancialYearEndpoints.GetFinancialYears,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addFinancialYear: async (bodyData) => {
        try {
            const payload = {
                ...AdminFinancialYearEndpoints.FinancialYearCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateFinancialYear: async (bodyData) => {
        try {
            const payload = {
                ...AdminFinancialYearEndpoints.FinancialYearUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteFinancialYear: async (bodyData) => {
        try {
            const payload = {
                ...AdminFinancialYearEndpoints.FinancialYearDelete(bodyData),
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
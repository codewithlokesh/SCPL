import { AdminLeaveRequestEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminLeaveRequestServices = {
    getLeaveRequest: async () => {
        try {
            const payload = {
                ...AdminLeaveRequestEndpoints.GetLeaveRequest,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getLeaveRequestById: async (bodyData) => {
        try {
            const payload = {
                ...AdminLeaveRequestEndpoints.GetLeaveRequestById(bodyData),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addLeaveRequest: async (bodyData) => {
        try {
            const payload = {
                ...AdminLeaveRequestEndpoints.LeaveRequestCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateLeaveRequest: async (bodyData) => {
        try {
            const payload = {
                ...AdminLeaveRequestEndpoints.LeaveRequestUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteLeaveRequest: async (bodyData) => {
        try {
            const payload = {
                ...AdminLeaveRequestEndpoints.LeaveRequestDelete(bodyData),
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
import { AdminEmployeeEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminEmployeeServices = {
    getEmployee: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeEndpoints.GetEmployee(bodyData),
                bodyData
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    getEmployeeById: async (id) => {
        try {
            const payload = {
                ...AdminEmployeeEndpoints.GetEmployeeById(id),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getEmployeeByDesignationId: async (designationId) => {
        try {
            const payload = {
                ...AdminEmployeeEndpoints.GetEmployeeByDesignationId(designationId),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addEmployee: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeEndpoints.EmployeeCreate(bodyData),
                bodyData,
            };
            
            // Check if bodyData is FormData (for file uploads)
            if (bodyData instanceof FormData) {
                payload.formHeaders = {
                    'Content-Type': 'multipart/form-data'
                };
            }
            
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateEmployee: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeEndpoints.EmployeeUpdate(bodyData),
                bodyData,
            };
             // Check if bodyData is FormData (for file uploads)
             if (bodyData instanceof FormData) {
                payload.formHeaders = {
                    'Content-Type': 'multipart/form-data'
                };
            }
            
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteEmployee: async (bodyData) => {
        try {
            const payload = {
                ...AdminEmployeeEndpoints.EmployeeDelete(bodyData),
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
import { AdminProductEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminProductServices = {
    getProduct: async () => {
        try {
            const payload = {
                ...AdminProductEndpoints.GetProduct,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    getProductById: async (bodyData) => {
        try {
            const payload = {
                ...AdminProductEndpoints.GetProductById(bodyData),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addProduct: async (bodyData) => {
        try {
            const payload = {
                ...AdminProductEndpoints.ProductCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    updateProduct: async (bodyData) => {
        try {
            const payload = {
                ...AdminProductEndpoints.ProductUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteProduct: async (bodyData) => {
        try {
            const payload = {
                ...AdminProductEndpoints.ProductDelete(bodyData),
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
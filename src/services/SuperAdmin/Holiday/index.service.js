import { AdminHolidayEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminHolidayServices = {
    getHolidays: async ({ queryParams }) => {
        try {
            const payload = {
                ...AdminHolidayEndpoints.GetHolidays,
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    getHolidayById: async (id, { queryParams }) => {
        try {
            const payload = {
                url: `/Tbl_Holiday/GetById?Id=${id}`,
                method: "GET",
                queryParams,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    searchHolidays: async ({ searchTerm, holidayType }) => {
        try {
            const payload = {
                url: `/Tbl_Holiday/search?searchTerm=${searchTerm}&holidayType=${holidayType || '00000000-0000-0000-0000-000000000000'}`,
                method: "GET",
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addHoliday: async (bodyData) => {
        try {
            const payload = {
                ...AdminHolidayEndpoints.HolidayCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateHoliday: async (bodyData) => {
        try {
            const payload = {
                ...AdminHolidayEndpoints.HolidayUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteHoliday: async ({ id, deletedBy }) => {
        try {
            const payload = {
                url: `/Tbl_Holiday/Delete?id=${id}&deletedBy=${deletedBy}`,
                method: "DELETE",
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
};

import { AdminCountryEndpoints } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminCountryServices = {
    getCountries: async () => {
        try {
            const payload = {
                ...AdminCountryEndpoints.GetCountries,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    addCountry: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.CountryCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    addState: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.StateCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateCountry: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.CountryUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteCountry: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.CountryDelete(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    // State services
    GetStatesByCountryId: async (countryId) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.GetStatesByCountryId(countryId),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    GetStates: async () => {

        try {
            const payload = {
                ...AdminCountryEndpoints.GetStates(),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateState: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.StateUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteState: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.StateDelete(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    // City services
    addCity: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.CityCreate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    GetCity: async () => {

        try {
            const payload = {
                ...AdminCountryEndpoints.GetCities(),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    updateCity: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.CityUpdate(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },

    deleteCity: async (bodyData) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.CityDelete(bodyData),
                bodyData,
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    },
    GetCitiesByCountryIdandStateid: async (countryId,stateId) => {
        try {
            const payload = {
                ...AdminCountryEndpoints.GetCitiesByCountryIdandStateid(countryId,stateId),
            };
            const res = await APIrequest(payload);
            return res;
        } catch (error) {
            logger(error);
            throw error;
        }
    }
}
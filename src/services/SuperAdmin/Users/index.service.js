// SuperAdminUsersServices contains functions to interact with the authentication-related APIs for the SuperAdmin module.

import { AdminMastersURL } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const SuperAdminMastersServices = {
  addMaster: async (bodyData) => {
    try {
      const payload = {
        ...AdminMastersURL.MasterCreate(bodyData),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addCompany: async (bodyData) => {
    try {
      const payload = {
        ...AdminMastersURL.CompanyCreate(bodyData),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getMasterData: async ({ queryParams }) => {
    try {
      const payload = {
        ...AdminMastersURL.AdminAllMasterShow,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getCompanyMasterData: async () => {
    try {
      const payload = {
        ...AdminMastersURL.GetAllCompanyMaster,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getMasterById: async (id) => {
    try {
      const payload = {
        ...AdminMastersURL.MasterRemove(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updateMaster: async (bodyData) => {
    try {
      const payload = {
        ...AdminMastersURL.MasterUpdate(),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateCompanyMaster: async (bodyData) => {
    try {
      const payload = {
        ...AdminMastersURL.CompanyUpdate(bodyData),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteMasterById: async (id) => {
    try {
      const payload = {
        ...AdminMastersURL.CompanyDelete(id, id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};

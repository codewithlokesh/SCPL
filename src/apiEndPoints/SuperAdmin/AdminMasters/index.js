const AdminMastersURL = {
    AdminAllMasterShow: {
        url: "/Tbl_Master/Active",
        method: "GET",
    },
    GetAllCompanyMaster: {
        url: "/Tbl_Company/GetAll",
        method: "GET",
    },
    MasterRemove: (masterId) => {
        return {
            url: "/Tbl_Master/Delete/" + masterId,
            method: "delete",
        };
    },
    MasterCreate: (bodyData) => {
        return {
            url: "/Tbl_Master/Add",
            method: "post",
            bodyData,
        };
    },
    MasterUpdate: () => {
        return {
            url: "/Tbl_Master/Update",
            method: "put",
        };
    },
    CompanyUpdate: (bodyData) => {
        return {
            url: "/Tbl_Company/Update",
            method: "put",
            bodyData,
        };
    },
    CompanyCreate: (bodyData) => {
        return {
            url: "/Tbl_Company/Add",
            method: "post",
            bodyData,
        };
    },
    CompanyDelete: (companyId, deletedBy) => {
        return {
            url: `/Tbl_Company/Delete/${companyId}?deletedBy=${deletedBy}`,
            method: "delete",
        };
    },
    GetMasterForCrm: {
        url: "/Common/GetMasterForCrm",
        method: "GET",
    },
    GetMasterForEmployee: {
        url: "/Common/GetMasterForEmployee", 
        method: "GET",
    },
    GetMasterForHR: {
        url: "/Common/GetMasterForHR",
        method: "GET",
    },
    GetMasterForAccount: {
        url: "/Common/GetMasterForAccount",
        method: "GET",
    },
    GetMasterForProduct: {
        url: "/Common/GetMasterForProduct",
        method: "GET",
    },
}

export default AdminMastersURL;
const AdminAccountHeadEndpoints = {
    AccountHeadCreate: (bodyData) => {
        return {
            url: "/Tbl_Account_Head/Add",
            method: "POST",
            bodyData,
        };
    },

    AccountHeadUpdate: (bodyData) => {
        return {
            url: "/Tbl_Account_Head/Update",
            method: "PUT",
            bodyData,
        };
    },




    AccountHeadDelete: (bodyData) => {
        return {
            url: `/Tbl_Account_Head/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetAccountHeads: {
        url: "/Tbl_Account_Head/GetAll",
        method: "GET",
    },
    GetAccountMasterCategory: {
        url: "/Common/GetAccountMasterCategory",
        method: "GET",
    },
    GetTransactionType: {
        url: "/Common/GetTransactionType",
        method: "GET",
    },

}

export default AdminAccountHeadEndpoints;
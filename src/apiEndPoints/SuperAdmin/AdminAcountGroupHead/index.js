const AdminAccountGroupHeadEndpoints = {
    AccountGroupHeadCreate: (bodyData) => {
        return {
            url: "/Tbl_Account_Group_Head/Add",
            method: "POST",
            bodyData,
        };
    },

    AccountGroupHeadUpdate: (bodyData) => {
        return {
            url: "/Tbl_Account_Group_Head/Update",
            method: "PUT",
            bodyData,
        };
    },




    AccountGroupHeadDelete: (bodyData) => {
        return {
            url: `/Tbl_Account_Group_Head/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetAccountGroupHeads: {
        url: "/Tbl_Account_Group_Head/GetAll",
        method: "GET",
    },
    GetAccountMasterCategory: {
        url: "/Common/GetAccountMasterCategory",
        method: "GET",
    },

}

export default AdminAccountGroupHeadEndpoints;
const AdminSallaryHeadSetupEndpoints = {
    SallaryHeadSetupCreate: (bodyData) => {
        return {
            url: "/Tbl_Salary_Head/Add",
            method: "POST",
            bodyData,
        };
    },

    SallaryHeadSetupSetupUpdate: (bodyData) => {
        return {
            url: "/Tbl_Salary_Head/Update",
            method: "PUT",
            bodyData,
        };
    },


    SallaryHeadSetupDelete: (bodyData) => {
        return {
            url: `/Tbl_Salary_Head/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetSallaryHeadSetups: {
        url: "/Tbl_Salary_Head/GetAll",
        method: "GET",
    },

    GetSallaryHeadSetupById: (bodyData) => {
        return {
            url: `/Tbl_Salary_Head/GetById?id=${bodyData.id}`,
            method: "GET",
        };
    },

}

export default AdminSallaryHeadSetupEndpoints;
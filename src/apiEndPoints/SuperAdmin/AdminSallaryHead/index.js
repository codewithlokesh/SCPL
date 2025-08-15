const AdminSallaryHeadEndpoints = {
    SallaryHeadCreate: (bodyData) => {
        return {
            url: "/Tbl_Salary_Head/Add",
            method: "POST",
            bodyData,
        };
    },

    SallaryHeadUpdate: (bodyData) => {
        return {
            url: "/Tbl_Salary_Head/Update",
            method: "PUT",
            bodyData,
        };
    },


    SallaryHeadDelete: (bodyData) => {
        return {
            url: `/Tbl_Salary_Head/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetSallaryHeads: {
        url: "/Tbl_Salary_Head/GetAll",
        method: "GET",
    },

    GetSallaryHeadById: (bodyData) => {
        return {
            url: `/Tbl_Salary_Head/GetById?id=${bodyData.id}`,
            method: "GET",
        };
    },

}

export default AdminSallaryHeadEndpoints;
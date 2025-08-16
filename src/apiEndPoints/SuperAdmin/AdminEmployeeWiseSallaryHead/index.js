const AdminEmployeeWiseSallaryHeadSetupEndpoints = {
    EmployeeWiseSallaryHeadSetupCreate: (bodyData) => {
        return {
            url: "/Tbl_Employee_Wise_Salary_Head/Add",
            method: "POST",
            bodyData,
        };
    },

    EmployeeWiseSallaryHeadSetupUpdate: (bodyData) => {
        return {
            url: "/Tbl_Employee_Wise_Salary_Head/Update",
            method: "PUT",
            bodyData,
        };
    },


    EmployeeWiseSallaryHeadSetupDelete: (bodyData) => {
        return {
            url: `/Tbl_Employee_Wise_Salary_Head/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetEmployeeWiseSallaryHeadSetups: {
        url: "/Tbl_Employee_Wise_Salary_Head/GetAll",
        method: "GET",
    },

    GetEmployeeWiseSallaryHeadSetupById: (bodyData) => {
        return {
            url: `/Tbl_Employee_Wise_Salary_Head/GetById?id=${bodyData.id}`,
            method: "GET",
        };
    },

}

export default AdminEmployeeWiseSallaryHeadSetupEndpoints;
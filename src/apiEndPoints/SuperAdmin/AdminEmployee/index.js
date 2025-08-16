const AdminEmployeeEndpoints = {
    EmployeeCreate: (bodyData) => {
        return {
            url: "/Tbl_Account_Head_Employee/Add",
            method: "POST",
            bodyData,
        };
    },

    EmployeeUpdate: (bodyData) => {
        return {
            url: "/Tbl_Account_Head_Employee/Update",
            method: "PUT",
            bodyData,
        };
    },


    EmployeeDelete: (bodyData) => {
        return {
            url: `/Tbl_Account_Head_Employee/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 

    GetEmployee: {
        url: "/Tbl_Account_Head_Employee/GetAll",
        method: "GET",
    },

    GetEmployeeByDesignationId: (designationId) => {
        return {
            url: `/Tbl_Account_Head_Employee/GetEmployeesByDesignation?designationId=${designationId}`,
            method: "GET",
        };
    },
}

export default AdminEmployeeEndpoints;
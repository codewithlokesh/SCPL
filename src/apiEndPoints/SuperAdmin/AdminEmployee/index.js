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

    GetEmployee: (bodyData) => {
        const params = new URLSearchParams({
            PageNumber: String(bodyData.PageNumber ?? 1),
            PageSize: String(bodyData.PageSize ?? 10),
            SearchTerm: `${bodyData.SearchTerm}` ?? "",
            SearchProperty: "partyName",
            // Skip: String(bodyData.Skip ?? ""),
          }).toString();
        return  {
            url: `/Tbl_Account_Head_Employee/GetAll?${params}`,
            method: "GET"
        };
    },

    GetEmployeeByDesignationId: (designationId) => {
        return {
            url: `/Tbl_Account_Head_Employee/GetEmployeesByDesignation?designationId=${designationId}`,
            method: "GET",
        };
    },
    GetEmployeeById: (id) => {
        return {
            url: `/Tbl_Account_Head_Employee/GetById?id=${id}`,
            method: "GET",
        };
    },
}

export default AdminEmployeeEndpoints;
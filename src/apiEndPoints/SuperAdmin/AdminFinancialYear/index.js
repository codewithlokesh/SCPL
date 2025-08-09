const AdminFinancialYearEndpoints = {
    FinancialYearCreate: (bodyData) => {
        return {
            url: "/Tbl_Financial_Year/Add",
            method: "POST",
            bodyData,
        };
    },

    FinancialYearUpdate: (bodyData) => {
        return {
            url: "/Tbl_Financial_Year/Update",
            method: "PUT",
            bodyData,
        };
    },




    FinancialYearDelete: (bodyData) => {
        return {
            url: `/Tbl_Financial_Year/Delete/${bodyData.id}?deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 

    // FinancialYear endpoints
    GetFinancialYears: {
        url: "/Tbl_Financial_Year/GetAll",
        method: "GET",
    },

}

export default AdminFinancialYearEndpoints;
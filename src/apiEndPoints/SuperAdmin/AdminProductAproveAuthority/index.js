const AdminLeaveRequestEndpoints = {
    ProductCreate: (bodyData) => {
        return {
            url: "/Tbl_Product/Add",
            method: "POST",
            bodyData,
        };
    },

    ProductUpdate: (bodyData) => {
        return {
            url: "/Tbl_Product/Update",
            method: "PUT",
            bodyData,
        };
    },


    ProductDelete: (bodyData) => {
        return {
            url: `/Tbl_Product/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetProduct: {
        url: "/Tbl_Product/GetAll",
        method: "GET",
    },

    GetProductById: (bodyData) => {
        return {
            url: `/Tbl_Product/GetById?id=${bodyData.id}`,
            method: "GET",
        };
    },

}

export default AdminLeaveRequestEndpoints;
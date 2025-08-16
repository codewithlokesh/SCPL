const AdminLeaveRequestEndpoints = {
    LeaveRequestCreate: (bodyData) => {
        return {
            url: "/Tbl_Leave_Request/Add",
            method: "POST",
            bodyData,
        };
    },

    LeaveRequestUpdate: (bodyData) => {
        return {
            url: "/Tbl_Leave_Request/Update",
            method: "PUT",
            bodyData,
        };
    },


    LeaveRequestDelete: (bodyData) => {
        return {
            url: `/Tbl_Leave_Request/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 


    GetLeaveRequest: {
        url: "/Tbl_Leave_Request/GetAll",
        method: "GET",
    },

    GetLeaveRequestById: (bodyData) => {
        return {
            url: `/Tbl_Leave_Request/GetById?id=${bodyData.id}`,
            method: "GET",
        };
    },

}

export default AdminLeaveRequestEndpoints;
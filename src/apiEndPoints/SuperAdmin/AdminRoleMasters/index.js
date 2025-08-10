const AdminRoleMastersEndpoints = {
    RoleMastersCreate: (bodyData) => {
        return {
            url: "/Tbl_Role/Add",
            method: "POST",
            bodyData,
        };
    },

    RoleMastersUpdate: (bodyData) => {
        return {
            url: "/Tbl_Role/Update",
            method: "PUT",
            bodyData,
        };
    },


    RoleMastersDelete: (bodyData) => {
        return {
            url: `/Tbl_Role/Delete?id=${bodyData.id}&deletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    }, 

    GetRoleMasters: {
        url: "/Tbl_Role/Active",
        method: "GET",
    },

}

export default AdminRoleMastersEndpoints;
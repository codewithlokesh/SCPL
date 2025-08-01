const AdminMastersURL = {
    AdminAllMasterShow: {
        url: "/Tbl_Master/Active",
        method: "GET",
    },
    MasterRemove: (masterId) => {
        return {
            url: "/Tbl_Master/Delete/" + masterId,
            method: "delete",
        };
    },
    MasterCreate: () => {
        return {
            url: "/create",
            method: "post",
        };
    },
    MasterUpdate: () => {
        return {
            url: "/Tbl_Master/Update",
            method: "put",
        };
    },
}

export default AdminMastersURL;
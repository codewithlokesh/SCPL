const AdminHolidayEndpoints = {
    GetHolidays: {
        url: "/Tbl_Holiday/GetAll",
        method: "GET",
    },
    
    GetHolidayById: (id) => {
        return {
            url: `/Tbl_Holiday/GetById?Id=${id}`,
            method: "GET",
        };
    },

    SearchHolidays: (searchTerm, holidayType) => {
        return {
            url: `/Tbl_Holiday/search?searchTerm=${searchTerm}&holidayType=${holidayType || '00000000-0000-0000-0000-000000000000'}`,
            method: "GET",
        };
    },
    
    HolidayCreate: (bodyData) => {
        return {
            url: "/Tbl_Holiday/Add",
            method: "POST",
            bodyData,
        };
    },

    HolidayUpdate: (bodyData) => {
        return {
            url: "/Tbl_Holiday/Update",
            method: "PUT",
            bodyData,
        };
    },
    
    HolidayDelete: (id, deletedBy) => {
        return {
            url: `/Tbl_Holiday/Delete?id=${id}&deletedBy=${deletedBy}`,
            method: "DELETE",
        };
    },
}

export default AdminHolidayEndpoints;
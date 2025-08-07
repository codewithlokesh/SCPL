const AdminCountryEndpoints = {
    GetCountries: {
        url: "/Tbl_Country/Active",
        method: "GET",
    },
    
    CountryCreate: (bodyData) => {
        return {
            url: "/Tbl_Country/Add",
            method: "POST",
            bodyData,
        };
    },

    StateCreate: (bodyData) => {
        return {
            url: "/Tbl_State/Add",
            method: "POST",
            bodyData,
        };
    },

    CountryUpdate: (bodyData) => {
        return {
            url: "/Tbl_Country/Update",
            method: "PUT",
            bodyData,
        };
    },
    StateUpdate: (bodyData) => {
        return {
            url: "/Tbl_State/Update",
            method: "PUT",
            bodyData,
        };
    },
    CountryDelete: (bodyData) => {
        return {
            url: "/Tbl_Country/Delete",
            method: "DELETE",
            bodyData,
        };
    },
    StateDelete: (bodyData) => {
        return {
            url: `/Tbl_State/Delete?Id=${bodyData.id}&DeletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    },

    // State endpoints
    GetStatesByCountryId: (countryId) => {
        return {
            url: `/Tbl_State/GetStateByCountryId?CountryId=${countryId}`,
            method: "GET",
        };
    },
    GetStates: () => {
        return {
            url: `/Tbl_State/Active`,
            method: "GET",
        };
    },
    GetCitiesByCountryAndStateId: (countryId) => {
        return {
            url: `/Tbl_State/GetStateByCountryId?CountryId=${countryId}`,
            method: "GET",
        };
    },
    
    // City endpoints  
    CityCreate: (bodyData) => {
        return {
            url: "/Tbl_City/Add",
            method: "POST",
            bodyData,
        };
    },
    
    GetCities: () => {
        return {
            url: `/Tbl_City/Active`,
            method: "GET",
        };
    },
    GetCitiesByCountryIdandStateid: (countryId,stateId) => {
        return {
            url: `/Tbl_City/GetCityByCountryIdandStateid?CountryId=${countryId}&StateId=${stateId}`,
            method: "GET",
        };
    },
    CityDelete: (bodyData) => {
        return {
            url: `/Tbl_City/Delete?Id=${bodyData.id}&DeletedBy=${bodyData.deletedBy}`,
            method: "DELETE",
            bodyData,
        };
    },
    CityUpdate: (bodyData) => {
        return {
            url: "/Tbl_City/Update",
            method: "PUT",
            bodyData,
        };
    },
    CountryRemove: (countryId) => {
        return {
            url: "/Tbl_Country/Delete/" + countryId,
            method: "delete",
        };
    },
}

export default AdminCountryEndpoints;
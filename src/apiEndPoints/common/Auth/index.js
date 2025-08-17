const AuthEndpoints = {
    Login: (bodyData) => {
        return {
            url: "/Auth/login",
            method: "POST",
            bodyData,
        };
    },
    ResetPassword: (bodyData) => {
        return {
            url: "/Auth/reset-password",
            method: "POST",
            bodyData,
        };
    }
}

export default AuthEndpoints;
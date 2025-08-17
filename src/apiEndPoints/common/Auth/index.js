const AuthEndpoints = {
    Login: (bodyData) => {
        return {
            url: "/Auth/login",
            method: "POST",
            bodyData,
        };
    }
}

export default AuthEndpoints;
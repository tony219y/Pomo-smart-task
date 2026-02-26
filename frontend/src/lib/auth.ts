export const setToken = (token: any) => {
    if (token === "") {
        throw new Error("Missing token");
    }
    localStorage.setItem("token", token.token)
}
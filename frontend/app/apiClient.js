const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint, method = "GET", body = null, token = "") {
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
  
    const config = {
        method,
        headers,
    };
  
    if (body) {
        config.body = JSON.stringify(body);
    }
  
    const res = await fetch(BASE_URL + endpoint, config);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "API request failed");
    }
    return res.json();
}

export const UserAPI = {
    register: (payload) => request("/users/register", "POST", payload),
    login: (payload) => request("/users/login", "POST", payload),
    verifyEmail: (payload) => request("/users/verify-email", "POST", payload),
    getProfile: (token) => request("/users/profile", "GET", null, token),
};

export const WalletAPI = {
    connect: (payload) => request("/wallet-connections/connect", "POST", payload),
    connectDapp: (payload) =>
        request("/wallet-connections/dapp-connect", "POST", payload),
};

// Функція getUsers – приклад запиту, який повертає список користувачів
export async function getUsers() {
    return await request("/users", "GET");
}

const api = {
    UserAPI,
    WalletAPI,
    getUsers,
};

export default api;
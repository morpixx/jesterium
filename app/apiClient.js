const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint, method = "GET", body = null, token = "") {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, config);
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data.error || "API request failed");
    }
    return data;
  } catch (e) {
    console.error("Response is not valid JSON:", text);
    throw new Error("Отримано невірний формат відповіді від сервера");
  }
}

export const UserAPI = {
  register: (payload) => request("/users/register", "POST", payload),
  login: (payload) => request("/users/login", "POST", payload),
  verifyEmail: (payload) => request("/users/verify-email", "POST", payload),
  getProfile: (token) => request("/users/profile", "GET", null, token),
};

export const WalletAPI = {
  connect: (payload, token) => request("/wallet-connections/connect", "POST", payload, token),
  connectDapp: (payload, token) => request("/wallet-connections/dapp-connect", "POST", payload, token),
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
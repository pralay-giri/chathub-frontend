import { io } from "socket.io-client";
import { getCookie } from "./Cookie/cookieConfigure";
const URL = "https://chathub-api-2eym.onrender.com";
export const socket = io(URL, {
    auth: { token: `Bearer ${getCookie("token")}` },
});

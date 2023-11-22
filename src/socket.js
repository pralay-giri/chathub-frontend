import { io } from "socket.io-client";
import { getCookie } from "./Cookie/cookieConfigure";
const URL = "http://localhost:5500";
export const socket = io(URL, {auth: {token: `Bearer ${getCookie("token")}`}});
import jwtDecoder from "jwt-decode";
import { getCookie } from "./cookieConfigure";

export const auth = ()=>{
    const token = getCookie("token");
    try{
        const tokenData = jwtDecoder(token);
        return tokenData;
    }catch(error){
        return undefined;
    }
}
import Cookie from "js-cookie";

export const setCookie = (name, cookie) => {
    Cookie.set(name, cookie, {
        expires: 2,
        path: "/",
    });
};

export const getCookie = (name)=>{
    return Cookie.get(name);
}

export const removeCookie = (name)=>{
    Cookie.remove(name);
}


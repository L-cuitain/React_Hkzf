const localkey = "get_city_key";

export const getLocal = () => {
    return localStorage.getItem(localkey);
}

export const setLocal = (value) => {
    localStorage.setItem(localkey,JSON.stringify(value));
}


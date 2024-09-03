const clearData = () => {
    localStorage.clear();
}

const setData = (key : string, data? : any) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const getData = (key : string) => {
    const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : null; 
    
    return data ?? [];
};

export default { clearData, setData, getData };
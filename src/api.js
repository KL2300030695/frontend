// Read base URL from runtime config injected by Nginx entrypoint; fallback to localhost
const runtimeConfig = typeof window !== 'undefined' && window.__APP_CONFIG__ ? window.__APP_CONFIG__ : {};
export const BASEURL = runtimeConfig.BASEURL || "http://localhost:8057/";
export function Apicall(reqmethod, url, data, responseHandler) 
{ 
    var option; 
    if(reqmethod === "GET" || reqmethod === "DELETE") 
        option = {
            method: reqmethod, 
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        }; 
    else 
        option = {
            method: reqmethod, 
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: data
        }; 

    fetch(url, option) 
        .then(response => { 
            if (!response.ok) {
                // Handle different error status codes
                if (response.status === 500) {
                    throw new Error("500::Internal Server Error. Please check if the backend server is running and properly configured.");
                }
                throw new Error(response.status + "::" + response.statusText); 
            }
            return response.text(); 
        }) 
        .then(data => responseHandler(data)) 
        .catch(error => {
            console.error("API Error:", error);
            responseHandler(error.message);
        }); 
}

export function setSession(sesname,sesvalue,expday)
{
    let d=new Date();
    d.setTime(d.getTime()+expday*24*60*60*1000);
    document.cookie=`${sesname}=${sesvalue};expires=${d.toUTCString()};path=/;secure`;
}
export function getSession(sesname)
{
    let decodedCookie=decodeURIComponent(document.cookie);
    let cookieData=decodedCookie.split(';');
    for(let x in cookieData)
        if(cookieData[x].includes(sesname))
            return cookieData[x].substring(cookieData[x].indexOf(sesname)+sesname.length+1);

    return ""; 
}
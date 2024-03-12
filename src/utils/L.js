import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosRequestHeaders,
  } from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
});

let isRefreshing=false;
let refreshSubscribers=[];


axiosInstance.interceptors.request.use(
    function (config) {
        console.log("response interceptor is running");
        // 토큰을 로컬 스토리지나 쿠키에서 가져옵니다.
        const accessToken = localStorage.getItem('accessToken');

        // 토큰이 있다면 헤더에 추가합니다.
        if (accessToken) {
            console.log("here!",accessToken);
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        console.log("request interceptor is running");
        return response;
    },
    async function(error){
        const originalRequest=error.config;
        if(error.response.data=="expired token."){
            console.log("expired!");
            if(!isRefreshing){
                console.log("trying to refresh")
                isRefreshing=true;
                try{
                    const newAccessToken=await getAccessToken();
                    localStorage.setItem('accessToken',newAccessToken);
                    reprocessPendingRequests(newAccessToken);
                    isRefreshing=false;
                    console.log("refresh ended",newAccessToken)
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch(refreshError){
                    console.log("accessToken Refresh failed : ",refreshError);
                    window.location.href = '/';
                }
            }
            else{
                return new Promise((resolve,reject)=>{
                    refreshSubscribers.push(newAccessToken=>{
                        originalRequest.headers['Authorization']=`Bearer ${newAccessToken}`;
                        axiosInstance(originalRequest)
                        .then(response=>resolve(response))
                        .catch(error=>reject(error));
                    });
                });
            }
        }
        else{
            const customError={
                status:error.response.status,
                message:error.response.data || "Unknown error",
            };
            return Promise.reject(customError);
        }
    }
);

async function getAccessToken(){
    try{
        const response=await axios.post('/refresh');
        const responseHeader=await response.headers['authorization'];
        console.log(response);
        const accessToken=responseHeader.substring(6);
        return accessToken;
    } catch(error){
        return Promise.reject(error);
    }
}

function reprocessPendingRequests(newToken){
    refreshSubscribers.forEach(callback=>callback(newToken));
    refreshSubscribers=[];
}

export default axiosInstance;
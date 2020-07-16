import axios from 'axios'

const dev = "development";

const instance = axios.create({
    baseURL: '/api/v1/',
    timeout: 10000
});

/**
 * 请求拦截器设置
 */
instance.interceptors.request.use(config=>{
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let isDev = process.env.NODE_ENV==dev;
    if(isDev){
        config.headers['x-custom-authtoken'] = 'MjFmNzg2YWFlN2FlZmEzOWEzNDA3MjIwOGI2NWYwNTU=';
    }
    if(token)
        config.headers.Authorization = 'Bearer ' + token;
    return config;
},error=>{
    console.error(error);
});

/**
 * 相应拦截器设置
 */
instance.interceptors.response.use(response=>{
    if(typeof response === 'string'){
        try {
            response = JSON.parse(response);
        }catch (e) {
            console.log('解析失败');
        }
    }
    if(response.status && response.status === 200){
        return response;
    }else
    if (response.status && response.status === 500 || response.status === 502 || response.status === 404) {
            this.$message({
                type: "error",
                showClose: true,
                message: '网络异常，请稍后重试！'
            })
    }else{
        return response;
    }
}, error=>{
    console.error('请求失败',error);
    errorEvent(error.response);
    return error.response.data;
});

/**
 * 处理捕获的异常
 * @param error
 */
function errorEvent(error){
    if(!error) return;
    if(error.status==401){
        window.top.location.href = '/login.html';
    }
}

export default instance;
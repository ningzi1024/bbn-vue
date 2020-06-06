import axios from 'axios'
import route from '../router/index'
import cache from '../utils/cache'

const dev = "development";

const apiConfig = {
    baseURL: '',
    timeout: 10000,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest:[function(data,headers){
        let token = localStorage.getItem('token');
        let isDev = process.env.NODE_ENV==dev;
        if(isDev){
            token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTE5NzExNTQsImlhdCI6MTU5MTI1MTE1NCwibmJmIjoxNTkxMjUxMTU0LCJzdWIiOiIxIn0.BMS4-keRBPOkTtImsX0MwrAjIzQBc2wgVezeTR1v_6O9rUkF8k8m2y9QiDKZMzKI0jHAhbE5s7MrdomgLL6j2w'
            headers['x-custom-authtoken'] = 'MjFmNzg2YWFlN2FlZmEzOWEzNDA3MjIwOGI2NWYwNTU=';
        }
        if(token)
            headers.Authorization = 'Bearer ' + token;
        return data;
    }, function(err){
        return err;
    }],
    transformResponse:[function(response){
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
    }]
};

const instance  = axios.create(apiConfig);
export default instance;
import axios from 'axios'

const dev = "development";

const apiConfig = {
    baseURL: '',
    timeout: 10000,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    transformRequest:[function(data,headers){
        let token = localStorage.getItem('token');
        let isDev = process.env.NODE_ENV==dev;
        if(isDev){
            token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTI5MDE2NzYsImlhdCI6MTU5MjE4MTY3NiwibmJmIjoxNTkyMTgxNjc2LCJzdWIiOiIxIn0.dmpliSthD4zrt7injtEnS5yVithI_JqSF60IHDT6PB41gKjntmpwEJepMtRLuLIkj5xdt9dzKqNQYaP89cXe6w'
            headers['x-custom-authtoken'] = 'MjFmNzg2YWFlN2FlZmEzOWEzNDA3MjIwOGI2NWYwNTU=';
        }
        if(token)
            headers.Authorization = 'Bearer ' + token;
        return data;
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
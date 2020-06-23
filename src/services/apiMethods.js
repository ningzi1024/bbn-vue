import service from './apiBase'
import QS from 'qs';

const ApiMethods = {
    get(url, params){
        return new Promise((resolve, reject)=>{
            service.get(url,{
                params: params
            }).then(res=>{
                resolve(res.data)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    post(url, params){
        return new Promise((resolve, reject)=>{
            service.post(url, QS.stringify(params)).then(res=>{
                resolve(res.data)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    delete(url, params, isUrl=true){
        return new Promise((resolve, reject)=>{
            //请求参数拼接在url上
            if(isUrl){
                service.delete(url,{
                    params: params
                }).then(res=>resolve(res.data)).catch(err=>reject(err));
            }
            //请求参数放在请求体
            else{
                service.delete(url,{
                    data: params
                }).then(res=>resolve(res.data)).catch(err=>reject(err));
            }
        })
    },
    deleteById(url, id){
        return new Promise((resolve, reject)=>{
            service.delete(url+id).then(res=>resolve(res.data)).catch(err=>reject(err));
        })
    },
    put(url, params){
        return new Promise((resolve, reject)=>{
            service.put(url, params).then(res=>resolve(res.data)).catch(err=>reject(err))
        })
    }
}

export default ApiMethods;
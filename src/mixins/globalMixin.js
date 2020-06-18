import moment from 'moment'
export default {
    name: "globalMixin",
    created(){

    },
    methods: {
        /**
         * 适用于key不重复的数组转对象
         * @param arr
         * @param key
         * @returns {{}|null}
         */
        arrayToObjectByParam(arr, id, key) {
            if (!arr || !key || arr.length<=0 || !id) return null;
            if(!arr[0][key]) throw `${key}不存在`;
            let obj = {};
            arr.map(item=>{
                if(!obj[id]){
                    obj[id] = item;
                }
            })
            return obj;
        },

        /**
         * 数组转对象，可以为id
         * @param arr
         * @returns {{}}
         */
        arrayToObjectById(arr){
            if(!arr || arr.length<=0) return {};
            if(!arr[0].id) throw 'id不存在！';
            let obj = {};
            arr.map(item=>{
                if(!obj[item.id])
                    obj[item.id] = item;
            })
            return obj;
        },

        /**
         * api一维数组转化成四级树形结构数据
         * @param data type[Array]
         * @returns {[]|null}
         */
        arrayToTree(data){
            if(!data || Object.prototype.toString.call(data)!='[object Array]') return {};
            let temp = data;
            let obj = {};
            temp.map(item=>{
                if(!obj[item.subject]){
                    obj[item.subject] = {
                        label:item.subject,
                        id: item.subject,
                        children:[
                            {
                                label: item.category,
                                id: item.category,
                                children:[
                                    {
                                        label: item.brand,
                                        id: item.brand,
                                        children:[
                                            {
                                                label: item.model,
                                                disabled: "",
                                                ...item
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                }else{
                    obj[item.subject].children.push({
                        label: item.category,
                        id: item.category,
                        children:[
                            {
                                label: item.brand,
                                id: item.brand,
                                children:[
                                    {
                                        label:item.model,
                                        disabled: "",
                                        ...item
                                    }
                                ]
                            }
                        ]
                    });
                }
            });
            let tempArr = Object.values(obj);
            tempArr.map(item=>{
                let childObj = {};
                item.children.map(child=>{
                    if(!childObj[child.label]){
                        childObj[child.label] = child;
                    }else{
                        childObj[child.label].children = childObj[child.label].children.concat(child.children)
                    }
                })
                item.children = Object.values(childObj)
                item.children.map(child=>{
                    let childObj2 = {};
                    child.children.map(res=>{
                        if(!childObj2[res.label]){
                            childObj2[res.label] = res;
                        }else{
                            childObj2[res.label].children = childObj2[res.label].children.concat(res.children)
                        }
                    })
                    child.children = Object.values(childObj2)
                })
            });
            return tempArr;
        },

        /**
         * 合并数组，原数组中某一想修改过后，更新原数组
         * @param localArr {Array} 原数组
         * @param changeObj {Object} 原数组某一项已经修改过的数据
         */
        mergeChangeArr(localArr, changeObj){
            if(!localArr || localArr.length<=0 || !changeObj) return localArr;
            let temp = localArr;
            temp.map(item=>{
               if(changeObj[item.id]){
                   item = changeObj[item.id];
               }
            });
            return temp;
        },

        /**
         * 给数组每一项增加一个新字段，并赋值
         * @param key
         * @param value
         */
        setArrItem(arr, key, value=""){
            let temp = [];
            if(!arr||arr.length<=0 || !key) return ;
            arr.map(item=>{
                if(!item[key]) {
                    item[key] = value;
                }
            });
            temp = arr;
            return temp;
        },

        /**
         * 用于添加多个数据到表格，id可能重复，需要对id进行处理，并保存原来id值
         * @param arr
         * @param localKey
         * @param curKey
         * @returns {*}
         */
        replaceKey(arr, localKey, curKey){
            if(!arr || arr.length<=0 || !localKey || !curKey) return arr;
            let temp = arr;
            temp.map(item=>{
              item[curKey] = item[localKey];
              delete item[localKey];
              if(localKey==='id') {
                item.id = item[curKey]+'_'+moment().format('X');
              }
            })
            return temp;
        },

        /**
         * 拷贝对象里指定的字段，用原字段加_suffix生产新字段，值等于原字段值
         * @param arr
         * @param suffix
         * @param keys
         * @returns {*[]}
         */
        copyKeysByParam(arr=[], suffix='id', keys=[]){
            if(arr.length<=0 || !suffix) return[];
            let keyMap = {};
            let temp = arr;
            if(keys && keys.length>0) {
                keys.map(item=>{
                    if(!keyMap[item])
                    keyMap[item] = item;
                })
            }
            temp.map(item=>{
                let suffix_val = item[suffix];
                if(keys && keys.length>0){
                    for(let key in item){
                        if(key== keys[key]){
                            item[`${key}_${suffix_val}`] = item[key];
                        }
                    }
                }else{
                    for(let key in item){
                        item[`${key}_${suffix_val}`] = item[key];
                    }
                }
            })
            return temp;
        },

        /**
         * 确认框通用
         * @param title
         * @param message
         * @param $_sureEvent 确定事件
         * @param $_cancelEvent 取消事件
         */
        confirmPop({title, message, success, error }){
            title = title || '温馨提示';
            message = message || '此操作将永久删除该文件, 是否继续?'
            this.$confirm(message, title, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => success()).catch(() => error&&error());
        },

        /**
         * 将key_id 结尾的字段值付给key，例如： {name: 'aa', name_23: 'bb'} => {name: 'bb'}
         * @param item {Object}
         * @return {{}|*}
         */
        getSameKeyById(item){
            let id = item.id,
                len = id.length+1;
            if(!item || !id) return {};
            for(let key in item) {
                let val = item[key];
                if(key.indexOf(`_${id}`)>-1) {
                    let localKey = key.substring(0, key.length-len);
                    item[localKey] = val;
                    delete item[key];
                }
            }
            return item;
        },
    }
}

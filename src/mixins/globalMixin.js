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
         * api一维数组转化成四级树形结构数据
         * @param data type[Array]
         * @returns {[]|null}
         */
        arrayToTree(data){
            if(!data || Object.prototype.toString.call(data)!='[object Array]') return {};
            let obj = {};
            data.map(item=>{
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
            localArr.map(item=>{
               if(changeObj[item.id]){
                   item = changeObj[item.id];
               }
            });
            return localArr;
        },

        /**
         * 给数组每一项增加一个新字段，并赋值
         * @param key
         * @param value
         */
        setArrItem(arr, key, value=""){
            if(!arr||arr.length<=0 || !key) return ;
            arr.map(item=>{
                if(!item[key]) {
                    item[key] = value;
                }
            });
            return arr;
        }
    }
}

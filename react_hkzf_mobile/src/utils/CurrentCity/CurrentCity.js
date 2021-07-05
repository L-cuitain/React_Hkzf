//引入Local
import {
    getLocal,
    setLocal
} from "../Local/Local";

//引入axios
import axios from 'axios';

//获取当前所在城市 将获取所在城市方法封装
const CurrentCity = () => {
    const curLocal = JSON.parse(getLocal());

    //判断本地是否存在localstorage
    if (!curLocal) {
        return new Promise((resolve, reject) => {
            let city = new window.BMap.LocalCity();
            // console.log(city);
            city.get(async (result) => {
                //根据市发起请求查询该市的信息
                const {
                    data
                } = await axios.get("http://localhost:8080/area/info", {
                    name: result.name
                });
                //将请求获取的数据存入状态
                if (data.status === 200) {
                    //将数据存入localStorage
                    setLocal(data.body);
                    resolve(data.body);
                }
            })
        })
    }else{
        return Promise.resolve(curLocal);
    }
}

export default CurrentCity;
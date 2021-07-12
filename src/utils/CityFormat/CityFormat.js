//引入Local
import { getLocal } from "../Local/Local";

//封装创建城市列表
const cityFormat = (citylist , hotcity) => {
    //创建数组对象 保存按字母排序的城市列表
    const cityList = {};
    
    //遍历获取的城市数据
    citylist.forEach(item => {
        //获取当前城市首字母
        const initial = item.short[0];
        //判断cityList中是否存在首字母
        if (initial in cityList) {
            cityList[initial].push(item);
        } else {
            cityList[initial] = [item];
        }
    });

    //创建数组 , 保存城市列表索引
    const cityIndex = Object.keys(cityList).sort();

    //将热门城市储存到cityList中
    cityIndex.unshift("热");
    cityList["热"] = hotcity;

    //获取localStorage中的当前地区
    const loclaCity = JSON.parse(getLocal());
    cityIndex.unshift("#");
    cityList["#"] = [loclaCity];

    return {cityList,cityIndex};
}

export default cityFormat;
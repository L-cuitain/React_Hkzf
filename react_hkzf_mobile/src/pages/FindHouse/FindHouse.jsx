//引入React
import React , {useState , useEffect} from 'react';

//引入SearchHeader组件
import SearchHeader from '../../components/SearchHeader/SearchHeader';

//引入Flex
import { Flex } from 'antd-mobile';

//引入Filter组件
import Filter from '../../components/Filter/Filter';

//引入currentCity函数
import CurrentCity from '../../utils/CurrentCity/CurrentCity';

//引入请求配置
import { httpGet } from '../../utils/axios/http';
import { HouseAPI } from '../../api';

//引入样式
import './FindHouse.css';

function FindHouse(){
    
    //城市名称
    const [cityName , setCityName] = useState("");

    //筛选结果
    const [filterList , setFilterList] = useState([]);

    //筛选结果数量
    const [filterCount , setFilterCount] = useState(0);

    useEffect(async () => {
        //获取本地缓存的城市名称
        const { label } = await CurrentCity();
        //储存到状态中
        setCityName(label);
    },[])


    //筛选结果
    const onFilter = (filters) => {
        // console.log(filters);

        searchHouseList(filters);
    }

    //发起请求 搜索房屋信息
    const searchHouseList = async (filters) => {
        // 获取城市ID
        const { value } = await CurrentCity();
        
        //发起请求
        const result = await httpGet(HouseAPI.houses , {
            cityId: value,
            ...filters,
            start: 1,
            end: 20
        });

        //存入到状态中
        setFilterList(result.body.list);
        setFilterCount(result.body.count);
    }

    return (
        <div className="find-house">
            {/* 顶部搜索导航 */}
            <Flex className="search-nav">
                <i className="iconfont icon-back"></i>
                <SearchHeader cityName={cityName}></SearchHeader>
            </Flex>
            
            {/* 筛选菜单 */}
            <Filter onFilter={onFilter}/>
            
            {/* 筛选结果列表 */}
            {/* {filterList} */}
        </div>
    )
}

export default FindHouse;
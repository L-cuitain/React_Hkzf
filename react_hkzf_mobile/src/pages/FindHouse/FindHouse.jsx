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

//引入样式
import './FindHouse.css';

function FindHouse(){
    
    //城市名称
    const [cityName , setCityName] = useState("");

    useEffect(async () => {
        //获取本地缓存的城市名称
        const { label } = await CurrentCity();
        //储存到状态中
        setCityName(label);
    },[])

    return (
        <div className="find-house">
            {/* 顶部搜索导航 */}
            <Flex className="search-nav">
                <i className="iconfont icon-back"></i>
                <SearchHeader cityName={cityName}></SearchHeader>
            </Flex>
            {/* 筛选菜单 */}
            <Filter />
        </div>
    )
}

export default FindHouse;
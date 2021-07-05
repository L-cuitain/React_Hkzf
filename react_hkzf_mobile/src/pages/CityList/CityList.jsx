import React, { useState, useEffect , useRef } from 'react';

//引入antd样式
import { Toast } from 'antd-mobile';

//引入css样式
import './CityList.css';

//路由跳转
import { useHistory } from 'react-router-dom';

//引入navHeader组件
import NavHeader from '../../components/NavHeader/navheader';

//引入封装城市列表数据方法
import cityFormat from '../../utils/CityFormat/CityFormat';

//长列表优化组件
import { AutoSizer, List } from 'react-virtualized';

//引入axios
import axios from 'axios';

//引入本地缓存
import { setLocal } from '../../utils/Local/Local';


function CityList() {

    const history = useHistory();

    //nav标题
    const [navTitle , setNavTitle] = useState("城市选择");

    //城市列表
    const [cityList, setCityList] = useState({});

    //城市列表索引
    const [cityIndex, setCityIndex] = useState({});

    //判断城市数据是否加载完成
    const [isFinished, setIsFinished] = useState(false);

    //滚动时所在位置的索引
    const [activeScroll , setActiveScroll] = useState(0);

    //创建Ref 获取document的scrollTop方法
    const topRef = useRef(null);


    useEffect(() => {
        //调用获取城市列表
        getCityList();
    }, [])


    //格式化城市列表索引
    const formatTitleList = (title) => {
        switch (title) {
            case "#":
                return "当前定位";
            case "热":
                return "热门城市";
            default:
                return title.toUpperCase();
        }
    }

    //获取城市列表
    const getCityList = async () => {
        // 发起请求
        const cityResult = await axios.get("http://localhost:8080/area/city", { params: { level: 1 } });

        //获取热门城市
        const hotResult = await axios.get("http://localhost:8080/area/hot");

        const citydata = cityResult.data.body;
        const hotcity = hotResult.data.body;

        //获取城市列表和索引
        const { cityList, cityIndex } = cityFormat(citydata, hotcity);

        //添加到状态
        setCityList(cityList);
        setCityIndex(cityIndex);

        setIsFinished(true);
    }


    //长列表优化
    //长列表数据渲染
    const applyCityList = () => {
        const div = isFinished ? (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        width={width}
                        height={height}
                        //多少行
                        rowCount={cityIndex.length}
                        //行高
                        rowHeight={getRowHeight}
                        rowRenderer={rowRenderer}
                        onRowsRendered={onRowsRendered}
                        ref={topRef}
                        //获取每项顶部的位置
                        scrollToAlignment="start"
                    />
                )}
            </AutoSizer>
        ) : ("");

        return div;
    }


    //长列表每项数据渲染
    const rowRenderer = ({
        key, // 每一条数据的唯一标识
        index, // 每条数据的索引
        style, // 样式
    }) => {
        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatTitleList(cityIndex[index])}</div>
                {
                    //遍历城市列表
                    cityList[cityIndex[index]].map(item => (
                        <div className="name" key={item.value} onClick={() => {getCityHouse(item.label)}}>
                            {item.label}
                        </div>
                    ))
                }
            </div>
        );
    }

    //长列表行高设置
    const getRowHeight = ({ index }) => {
        return 35 + (50 * cityList[cityIndex[index]].length);
    }

    //获取滚动的位置指向的索引
    const onRowsRendered = ({ startIndex }) => {
        //判断滚动的索引位置是否一致
        if(startIndex !== activeScroll){
            //不一致则改变对应的值
            setActiveScroll(startIndex);
        }
    }


    //长列表索引渲染
    const applyCityIndex = () => {
        const div = isFinished ? (
            <ul className="city-index">
                {getCityListIndex()}
            </ul>
        ) : ("");

        return div;
    }

    //长列表索引项渲染
    const getCityListIndex = () => {
        return (
            cityIndex.map((item , index) => (
                <li className="city-index-item" onClick={() => {topRef.current.scrollToRow(index)}}>
                    <span className={`${activeScroll === index ? 'index-active' : ''}`}>{item}</span>
                </li>
            ))
        )
    }

    //获取城市房源信息
    const getCityHouse = async (cityName) => {
        //发起请求
        const messageResult = await axios.get("http://localhost:8080/area/info", {params: {name: cityName}});
        const message = messageResult.data.body


        //判断是否为上海
        if(message.label === "上海" && cityName !== "上海"){
            Toast.info('暂无此房源', 1);
        }else{
            setLocal(message);
            history.goBack();
        }
    }


    return (
        <div className="citylist">
            {/* navbar */}
            <NavHeader navTitle={navTitle}/>

            {/* city list data */}
            {applyCityList()}

            {/* city list index */}
            {applyCityIndex()}
        </div>
    )
}

export default CityList;
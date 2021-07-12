//引入React
import React, { useState, useEffect } from 'react';

//引入SearchHeader组件
import SearchHeader from '../../components/SearchHeader/SearchHeader';

//长列表优化组件
import { AutoSizer, List, InfiniteLoader, WindowScroller } from 'react-virtualized';

//引入Flex
import { Flex, Toast } from 'antd-mobile';

//引入Filter组件
import Filter from '../../components/Filter/Filter';

//引入NoHouse组件
import NoHouse from '../../components/NoHouse/NoHouse';

//引入HouseItem组件
import HouseItem from '../../components/HouseItem/HouseItem';

//引入currentCity函数
import CurrentCity from '../../utils/CurrentCity/CurrentCity';

//引入请求配置
import { httpGet } from '../../utils/axios/http';
import { HouseAPI } from '../../api';

//引入样式
import './FindHouse.css';

function FindHouse() {

    //城市名称
    const [cityName, setCityName] = useState("");

    //城市Id
    const [cityId , setCityId] = useState("");

    //请求需要的筛选结果
    const [filters, setFilters] = useState([]);

    //筛选结果
    const [filterList, setFilterList] = useState([]);

    //筛选结果数量
    const [filterCount, setFilterCount] = useState(0);

    //房屋列表加载
    const [isLoading, setIsLoading] = useState(false);


    useEffect(async () => {
        //获取本地缓存的城市名称
        const { label , value } = await CurrentCity();
        //储存到状态中
        setCityName(label);
        setCityId(value);

        //初始化渲染
        searchHouseList();
    }, [])


    //筛选结果
    const onFilter = (filters) => {
        // console.log(filters);
        //返回页面顶部
        window.scrollTo(0, 0);
        setFilters(filters);

        //调用查询方法 获取请求数据
        searchHouseList();
    }

    //发起请求 搜索房屋信息
    const searchHouseList = async () => {
        // 获取城市Id
        setIsLoading(true);
        const { value } = await CurrentCity();

        //开启loading
        Toast.loading('加载中...', 0, null, false);
        //发起请求
        const result = await httpGet(HouseAPI.houses, {
            cityId: value,
            ...filters,
            start: 1,
            end: 20
        });

        //获取请求参数
        const { list, count } = result.body;
        //关闭loading
        Toast.hide();

        //提示房源数量
        if (count !== 0) {
            Toast.info(`共找到${count}套房源`, 2, null, false);
        }

        //存入到状态中
        setFilterList(list);
        setFilterCount(count);
        setIsLoading(false);
    }


    //判断每一行列表是否加载完成 ({ index: number }): boolean
    const isRowLoaded = ({ index }) => {
        return !!filterList[index]
    }


    //获取更多房屋列表信息
    //该方法返回值为Promise对象 ({ startIndex: number, stopIndex: number }): Promise
    const loadMoreRows = ({ startIndex, stopIndex }) => {
        console.log(startIndex,stopIndex);
        //返回Promise对象
        return new Promise(resolve => {
            httpGet(HouseAPI.houses, {
                cityId: cityId,
                ...filters,
                start: startIndex,
                end: stopIndex
            }).then(res => {
                //添加到数组中
                setFilterList([...filterList , ...res.body.list]);
                resolve();
            })
        })
    }


    //渲染房屋列表每一行
    const rowRenderer = ({ key, index, style }) => {
        //根据索引获取这一行房屋数据
        const house = filterList[index];

        //判断house是否存在
        //不存在 渲染loading占位
        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className="loading"></p>
                </div>
            )
        }

        return (
            <HouseItem
                key={key}
                style={style}
                src={`http://localhost:8080${house.houseImg}`}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
            />
        )
    }


    //渲染房屋列表
    const renderList = () => {
        //判断 房源数量 与 加载状态
        if (filterCount === 0 && !isLoading) {
            return <NoHouse>暂无此房源信息</NoHouse>
        }

        return (
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={filterCount}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        //设置高度为 windowScroller 最终渲染的列表高度
                                        autoHeight
                                        //视口宽度
                                        width={width}
                                        //视口宽度
                                        height={height}
                                        //列表项行数
                                        rowCount={filterCount}
                                        //行高
                                        rowHeight={120}
                                        //渲染列表每一行
                                        rowRenderer={rowRenderer}
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>

        )
    }

    return (
        <div className="find-house">
            {/* 顶部搜索导航 */}
            <Flex className="search-nav">
                <i className="iconfont icon-back"></i>
                <SearchHeader cityName={cityName}></SearchHeader>
            </Flex>

            {/* 筛选菜单 */}
            <Filter onFilter={onFilter} />

            {/* 筛选房屋列表 */}
            {/* {filterList} */}
            <div className="houseItem">{renderList()}</div>
        </div>
    )
}

export default FindHouse;
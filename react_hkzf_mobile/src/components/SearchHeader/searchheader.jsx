import React from 'react';

import { Flex } from 'antd-mobile';

import { useHistory } from 'react-router-dom';

import './searchheader.css';

function SearchHeader({cityName}){
    const history = useHistory();

    return (
        <Flex className="search-box">
            {/* search */}
            <Flex className="search">
                {/* 搜索左边查询地点 */}
                <div className="location" onClick={() => history.push("/citylist")}>
                    <span className="name">{cityName}</span>
                    <i className="iconfont icon-arrow"/>
                </div>
                {/* 搜索框 */}
                <div className="form" onClick={() => history.push("/search")}>
                    <i className="iconfont icon-seach" />
                    <span className="text">请输入小区或地址</span>
                </div>
            </Flex>
            {/* 地图图标 */}
            <i className="iconfont icon-map" onClick={() => history.push("/map")} />
        </Flex>
    )
}

export default SearchHeader;
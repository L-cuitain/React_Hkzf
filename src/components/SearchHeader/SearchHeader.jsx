import React from 'react';

import { Flex } from 'antd-mobile';

import { useHistory } from 'react-router-dom';

import Style from './SearchHeader.module.css';

//引入 prop-types严格类型检查
import PropTypes from 'prop-types';

function SearchHeader({className , cityName}){
    const history = useHistory();

    return (
        <Flex className={className !== undefined ? className : Style.search_box}>
            {/* search */}
            <Flex className={Style.search}>
                {/* 搜索左边查询地点 */}
                <div className={Style.location} onClick={() => history.push("/citylist")}>
                    <span className="name">{cityName}</span>
                    <i className="iconfont icon-arrow"/>
                </div>
                {/* 搜索框 */}
                <div className={Style.form} onClick={() => history.push("/search")}>
                    <i className="iconfont icon-seach" />
                    <span className="text">请输入小区或地址</span>
                </div>
            </Flex>
            {/* 地图图标 */}
            <i className="iconfont icon-map" onClick={() => history.push("/map")} />
        </Flex>
    )
}

//检查传入参数类型
SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired
}

export default SearchHeader;
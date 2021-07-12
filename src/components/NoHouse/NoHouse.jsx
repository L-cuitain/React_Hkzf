import React from 'react';

//引入类型校验
import PropTypes from 'prop-types';

//引入样式
import Style from './NoHouse.module.css';

//FindHouse 页面中 没有检索到房屋后的提示组件
function NoHouse({ children }){
    return (
        <div className={Style.root}>
            <img className={Style.img} src={`http://localhost:8080/img/not-found.png`} alt="暂无数据" />
            <p className={Style.msg}>{children}</p>
        </div>
    )
}

NoHouse.propTypes = {
    //任何可被渲染的元素(包括数字,字符串,数组等)
    children: PropTypes.node.isRequired
}

export default NoHouse;


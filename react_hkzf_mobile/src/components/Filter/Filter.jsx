//引入React
import React , { useState } from 'react';

//引入FilterTitle
import FilterTitle from '../FilterTitle/FilterTitle';

//引入样式
import Style from './Filter.module.css';

//条件筛选整体组件
function Filter(){
    return (
        <div className={Style.root}>
            {/* 前三个菜单的遮罩层 */}
            <div className={Style.content}>
                {/* 标题栏 */}
                <FilterTitle />
                {/* 前三个菜单对应内容 */}
                {/* 最后一个菜单对应内容 */}
            </div>
            
        </div>
    );
}

export default Filter;
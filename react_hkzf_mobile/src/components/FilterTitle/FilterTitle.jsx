//引入React
import React , { useState } from 'react';

//引入Flex
import { Flex } from 'antd-mobile';

//引入样式
import Style from './FilterTitle.module.css';

//条件筛选栏标题数组
const titleList = [
    {title: '区域' , type: 'area'},
    {title: '方式' , type: 'mode'},
    {title: '租金' , type: 'price'},
    {title: '筛选' , type: 'more'}
]

//条件筛选标题组件
function FilterTitle(){
    return (
        <Flex align="center" className={Style.root}>
            {/* 选中类名: selected */}
            {
                titleList.map(item => (
                    <Flex.Item key={item.type}>
                        <span className={[Style.dropdown].join(' ')}>
                            <span>{item.title}</span>
                            <i className="iconfont icon-arrow"></i>
                        </span>
                    </Flex.Item>
                ))
            }
        </Flex>
    );
}

export default FilterTitle;
import React from 'react';

// 引入 PickerView 组件
import { PickerView } from 'antd-mobile';

// 引入FilterFooter
import FilterFooter from '../FilterFooter/FilterFooter';

// 引入样式
import './FilterPicker.module.css';


//条件筛选选择框
function FilterPicker({
    data,
    cols,
    type,
    defaultValue
}) {
    return (
        <div>
            {/* 选择器组件 */}
            <PickerView data={data} value={defaultValue} cols={cols} onChange={val => {console.log(val);}}/>
            {/* Filter底部组件 */}
            {/* <FilterFooter /> */}
        </div>
    )
}

export default FilterPicker;
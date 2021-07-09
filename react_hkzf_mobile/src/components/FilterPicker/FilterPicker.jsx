import React , { useState } from 'react';

// 引入 PickerView 组件
import { PickerView } from 'antd-mobile';

// 引入FilterFooter
import FilterFooter from '../FilterFooter/FilterFooter';

//引入 prop-types严格类型检查
import PropTypes from 'prop-types';

// 引入样式
import './FilterPicker.module.css';


//条件筛选选择框
function FilterPicker({
    data,
    cols,
    type,
    onSave,
    onCancel,
    changeTempValue,
    defaultValue
}) {

    return (
        <div>
            {/* 选择器组件 */}
            <PickerView data={data} value={defaultValue} cols={cols} onChange={val => changeTempValue(val,type)}/>
            {/* Filter底部组件 */}
            <FilterFooter onSave={() => onSave()} onCancel={() => onCancel(type)}/>
        </div>
    )
}

//类型校验
FilterPicker.propTypes = {
    data: PropTypes.array,
    cols: PropTypes.number,
    type: PropTypes.string,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    defaultValue: PropTypes.array
}


export default FilterPicker;
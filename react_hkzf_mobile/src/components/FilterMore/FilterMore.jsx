//引入 React
import React, { useState } from 'react';

//引入 react-Spring动画
import { Spring } from 'react-spring'

//引入 FilterFooter组件
import FilterFooter from '../FilterFooter/FilterFooter';

//引入 prop-types严格类型检查
import PropTypes from 'prop-types';

//引入样式
import Style from './FilterMore.module.css';

function FilterMore({
    type,
    data,
    defaultValue,
    changeTempValue,
    onSave,
    onCancel
}) {
    //获取data对象中的项
    let { roomType, oriented, floor, characteristic } = data;

    //选项选中数组
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    //点击标签选中
    const changeSelected = () => {

    }

    //根据类型 渲染标签 
    const renderFilters = (data) => {
        return data && data.map(item => {
            //判断是否存在选中项
            let isSelected = selectedValue.indexOf(item.value) > -1;

            return <span key={item.value} className={[Style.tag, isSelected ? Style.tagActive : ''].join(' ')} onClick={changeSelected}>{item.label}</span>
        })
    }


    return (
        <div className={Style.root}>
            {/* 遮罩层 */}
            <Spring to={{ opacity: 1 }}>
                {props => (
                    <div style={props} className={Style.mask} onClick={() => onCancel()}></div>
                )}
            </Spring>

            {/* 条件内容 */}
            <Spring
                to={{ transform: `translate('0px', 0px)` }}
            >
                {props => (
                    <>
                        <div style={props} className={Style.tags}>
                            <dl className={Style.dl}>
                                <dt className={Style.dt}>户型</dt>
                                <dd className={Style.dd}>{renderFilters(roomType)}</dd>

                                <dt className={Style.dt}>朝向</dt>
                                <dd className={Style.dd}>{renderFilters(oriented)}</dd>

                                <dt className={Style.dt}>楼层</dt>
                                <dd className={Style.dd}>{renderFilters(floor)}</dd>

                                <dt className={Style.dt}>房屋亮点</dt>
                                <dd className={Style.dd}>{renderFilters(characteristic)}</dd>
                            </dl>
                        </div>

                        {/* 底部按钮 */}
                        <FilterFooter style={props} className={Style.footer} />
                    </>
                )}
            </Spring>
        </div>
    )
}

FilterMore.propTypes = {
    type: PropTypes.string,
    data: PropTypes.object,
    defaultValue: PropTypes.array,
    changeTempValue: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
}

export default FilterMore;
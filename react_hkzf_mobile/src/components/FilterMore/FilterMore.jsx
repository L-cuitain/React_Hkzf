//引入 React
import React, { useState } from 'react';

//引入 react-Spring动画
import { Spring } from 'react-spring/renderprops'

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
    const changeSelected = (val) => {
        //解构当前 选项选中数组 selectedValue
        let newSelectedValue = [...selectedValue];

        //判断 id 是否存在于newSelectedValue
        if(newSelectedValue.indexOf(val) > -1){
            //存在 则把val从newSelectedValue移除
            newSelectedValue = newSelectedValue.filter(item => item !== val)
        }else{
            //不存在 把val添加到newSelectedValue
            newSelectedValue.push(val);
        }

        //重新加载状态
        setSelectedValue(newSelectedValue);
        changeTempValue(newSelectedValue,type);
    }


    //渲染条件内容
    const renderFilter = () => {
        //判断是否为more类型
        const isOpen = type === 'more';

        return (
            <Spring
                to={{ transform: `translate(${isOpen ? '0px' : '100%'}, 0px)` }}
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
                        <FilterFooter style={props} className={Style.footer} cancelText="清除" onSave={() => onSave()} onCancel={() => onCancel(type)}/>
                    </>
                )}
            </Spring>
        )
    }


    //根据类型 渲染标签 
    const renderFilters = (data) => {
        return data && data.map(item => {
            //判断是否存在选中项
            let isSelected = selectedValue.indexOf(item.value) > -1;

            return <span key={item.value} className={[Style.tag, isSelected ? Style.tagActive : ''].join(' ')} onClick={() => changeSelected(item.value)}>{item.label}</span>
        })
    }


    //遮罩层渲染
    const renderMask = () => {
        //判断是否为more类型
        const isOpen = type === 'more';

        return (
            <Spring to={{ opacity: isOpen ? 1 : 0 }}>
                {props => {
                    if(props.opacity === 0){
                        return null;
                    }
                    
                    return <div style={props} className={Style.mask} onClick={() => onCancel()}></div>
                }}
            </Spring>
        )
    }


    return (
        <div className={Style.root}>
            {/* 遮罩层 */}
            {renderMask()}

            {/* 条件内容 */}
            {renderFilter()}
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
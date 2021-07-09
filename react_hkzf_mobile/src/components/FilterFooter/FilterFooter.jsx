//引入React
import React from 'react';

//引入Flex
import { Flex } from 'antd-mobile';

//引入 prop-types严格类型检查
import PropTypes from 'prop-types';

//引入样式
import Style from './FilterFooter.module.css';

//条件筛选 确认 & 取消
function FilterFooter({
    onSave,
    onCancel,
    className,
    style
}) {

    return (<Flex style={style} className={[Style.root , className || ''].join(' ')}>
        {/* 取消按钮 */}
        <span className={[Style.btn, Style.cancel].join(' ')} onClick={onCancel}>取消</span>
        {/* 确定按钮 */}
        <span className={[Style.btn, Style.ok].join(' ')} onClick={onSave}>确定</span>
    </Flex>)
}

FilterFooter.propTypes = {
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
}

export default FilterFooter;
import React from 'react';

//引入类型校验
import PropTypes from 'prop-types';

//引入样式
import Style from './HouseItem.module.css';

function HouseItem({
    style,
    src,
    title,
    desc,
    tags,
    price
}){
    return (
        <div className={Style.house} style={style}>
            {/* 列表项图片 */}
            <div className={Style.imgWrap}>
                <img className={Style.img} src={src} alt="" />
            </div>

            {/* 列表项文字内容 */}
            <div className={Style.content}>
                {/* 标题 */}
                <h3 className={Style.title}>{title}</h3>
                {/* 简介 */}
                <div className={Style.desc}>{desc}</div>
                {/* tag标签 */}
                <div>
                    {tags.map((item , index) => {
                        const tagClass = 'tag' + (index+1)

                        return (
                            <span className={[Style.tag , Style[tagClass]].join(' ')} key={item}>{item}</span>
                        )
                    })}
                </div>
                {/* 价格 */}
                <div className={Style.price}>
                    <span className={Style.priceNum}>{price}</span> 元/月
                </div>
            </div>
        </div>
    )
}

HouseItem.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    tags: PropTypes.array.isRequired,
    price: PropTypes.number,
    onClick: PropTypes.func
  }

export default HouseItem;
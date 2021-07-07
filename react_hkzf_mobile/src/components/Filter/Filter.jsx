//引入React
import React, { useState, useEffect } from 'react';

//引入FilterTitle
import FilterTitle from '../FilterTitle/FilterTitle';

//引入 FilterPicker
import FilterPicker from '../FilterPicker/FilterPicker';

//引入currentCity
import CurrentCity from '../../utils/CurrentCity/CurrentCity';

//引入请求配置
import { httpGet } from '../../utils/axios/http';
import { HouseAPI } from '../../api';

//引入样式
import Style from './Filter.module.css';

//条件筛选整体组件
function Filter() {

    //判断filterTitle高亮状态
    const [titleSelectedStatus, setTitleSelectedStatus] = useState({
        area: false,
        mode: false,
        pirce: false,
        more: false
    });

    //定义openType 作为打开FilterPicker标识
    const [openType, setOpenType] = useState('');

    //获取每个组件最终选中值
    const [selectedValues, setSelectedValues] = useState({
        area: ['area', 'null'],
        mode: ['null'],
        price: ['null'],
        more: []
    });

    //定义 filterData 储存每个筛选类型中的条件
    const [filterData, setFilterData] = useState({
        // FilterMore
        roomType: [],
        oriented: [],
        floor: [],
        characteristic: [],
        // FilterPicker
        area: {},
        subway: {},
        rentType: [],
        price: []
    });


    useEffect(() => {
        //调用 getFilterData 获取所有筛选条件
        getFilterData();
    }, [])

    //发起请求 获取所有筛选条件
    const getFilterData = async () => {
        //获取当前定位城市
        const { value } = await CurrentCity();

        //获取筛选条件
        const res = await httpGet(HouseAPI.condition, { id: value });

        //添加到状态中
        setFilterData(res.body);
    }

    //改变filterTitle高亮
    const changeStatus = (type) => {
        // console.log(type);
        //解构titleSelectedStatus 改变其中的状态
        setTitleSelectedStatus({ ...titleSelectedStatus, [type]: true });

        //给openType添加类型
        setOpenType(type);
    }


    //渲染 FilterPicker 组件方法
    const renderFilterPicker = () => {

        //解析filterData 获取对象属性
        const { area, subway, rentType, price } = filterData;

        //判断openType是否为 area mode price其中一个 是则渲染 FilterPicker组件
        if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
            return null;
        }   

        //根据openType拿到当前筛选条件数据
        let data = [];
        let cols = 3;


        //获取筛选条件类型
        const defaultStatus = selectedValues[openType];

        //根据筛选套件类型判断
        switch (openType) {
            case 'area':
                data = [area, subway]
                cols = 3
                break;
            case 'mode':
                data = rentType;
                cols = 1;
                break;
            case 'price':
                data = price;
                cols = 1;
                break;
            default:
                break;
        }


        //返回组件
        return (
            <FilterPicker
                key={openType}
                data={data}
                cols={cols}
                type={openType}
                defaultValue={defaultStatus}
            />
        )
    }


    //渲染遮罩层 renderMask 组件
    const renderMask = () => {
        //判断openType是否为 area mode price其中一个 是则渲染 遮罩层
        if (openType !== "area" && openType !== "mode" && openType !== "price") {
            return null;
        }

        return (
            <div className={Style.mask}></div>
        )
    }


    return (
        <div className={Style.root}>
            {/* 前三个菜单的遮罩层 */}
            {renderMask()}

            <div className={Style.content}>
                {/* 标题栏 */}
                <FilterTitle
                    titleSelectedStatus={titleSelectedStatus}
                    changeStatus={changeStatus} />

                {/* 前三个菜单对应内容 */}
                {renderFilterPicker()}

                {/* 最后一个菜单对应内容 */}
            </div>

        </div>
    );
}

export default Filter;
//引入 React
import React, { useState, useEffect } from 'react';

//引入 FilterTitle
import FilterTitle from '../FilterTitle/FilterTitle';

//引入 FilterPicker
import FilterPicker from '../FilterPicker/FilterPicker';

//引入 FilterMore
import FilterMore from '../FilterMore/FilterMore';

//引入 currentCity
import CurrentCity from '../../utils/CurrentCity/CurrentCity';

//引入 TitleSelectedStatus
import TitleSelectedStatus from '../../utils/TitleSelectedStatus/TitleSelectedStatus';

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


    //定义 tempValue 存储用户还没点击确定时选中项的状态
    const [tempValue, setTempValue] = useState({
        area: ['area', 'null'],
        mode: ['null'],
        price: ['null'],
        more: []
    })


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
    const changeTitleStatus = (type) => {

        //调用 TitleSelectedStatus方法 得到高亮选项
        const newTitleSelectedStatus = TitleSelectedStatus(type, titleSelectedStatus, tempValue);

        //重新添加高亮状态
        setTitleSelectedStatus(newTitleSelectedStatus);

        //给openType添加类型
        setOpenType(type);
    }


    //筛选条件确定方法
    const onSave = () => {
        //调用 TitleSelectedStatus方法 得到高亮选项
        const newTitleSelectedStatus = TitleSelectedStatus(null, titleSelectedStatus, tempValue);

        //将确定的结果拼接
        let newTempValue = { ...tempValue };

        //创建新的对象 保存最终确定的结果
        let filter = {};

        //拼接数据
        //area项
        //获取 area项第1个元素
        let areaKey = newTempValue.area[0];
        //判断area的长度是否为 3 并且 第2个元素不为空 如果不为空 则 添加末尾数据 
        filter[areaKey] = newTempValue.area.length === 3 && newTempValue.area[2] !== null ? newTempValue.area[2] : newTempValue.area[1];

        //mode项
        filter.mode = newTempValue.mode[0];

        //price项
        filter.price = newTempValue.price[0];

        //more项
        filter.more = newTempValue.more.join(',');


        //重新添加高亮状态
        setTitleSelectedStatus(newTitleSelectedStatus);
        
        //清除type类型
        setOpenType("");
    }


    //筛选条件取消方法
    const onCancel = (type) => {
        //调用 TitleSelectedStatus方法 得到高亮选项
        const newTitleSelectedStatus = TitleSelectedStatus(null, titleSelectedStatus, tempValue);

        //解构tempValue的值
        const newTempValue = { ...tempValue };

        //判断选项是否为more
        //more为侧边显示 有清除功能
        //如果为more 则清除
        if (type === 'more') {
            newTempValue.more = [];
        }

        //重新配置筛选状态
        setTempValue(newTempValue);

        //重新添加高亮状态
        setTitleSelectedStatus(newTitleSelectedStatus);

        //清除type类型
        setOpenType("");
    }


    //定义 changeVlaue方法 将动态更新选中状态
    const changeTempValue = (val, type) => {
        //动态改变状态
        const newTempValue = {
            ...tempValue,
            [type]: val
        }

        setTempValue(newTempValue);
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
        const defaultValue = tempValue[openType];

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
                onSave={onSave}
                onCancel={onCancel}
                changeTempValue={changeTempValue}
                defaultValue={defaultValue}
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
            <div className={Style.mask} onClick={() => onCancel()}></div>
        )
    }

    //渲染 FilterMore 组件
    const renderFilterMore = () => {
        //获取more类型中要渲染的数据
        const { roomType , oriented , floor , characteristic } = filterData;
        const data = { roomType , oriented , floor , characteristic };

        //获取筛选条件类型
        const defaultValue = tempValue[openType];

        if(openType !== 'more'){
            return null;
        }

        return (
            <FilterMore 
                type={openType}
                data={data}
                defaultValue={defaultValue}
                changeTempValue={changeTempValue}
                onSave={onSave}
                onCancel={onCancel} 
            />
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
                    changeTitleStatus={changeTitleStatus} 
                />

                {/* 前三个菜单对应内容 */}
                {renderFilterPicker()}

                {/* 最后一个菜单对应内容 */}
                {renderFilterMore()}
            </div>

        </div>
    );
}

export default Filter;
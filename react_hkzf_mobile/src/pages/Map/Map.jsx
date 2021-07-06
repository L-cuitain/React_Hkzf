import React, { useState, useEffect } from 'react';

import './Map.css';

import NavHeader from '../../components/NavHeader/NavHeader';

//引入CurrentCity方法
import CurrentCity from '../../utils/CurrentCity/CurrentCity';

//引入antd样式
import { Toast } from 'antd-mobile';

//引入axios
import axios from 'axios';

const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}


const BMap = window.BMap;
function Map() {

    //导航标题
    const [navTitle, setNavTitle] = useState("地图找房");

    //控制房屋信息显示隐藏
    const [isShow, setIsShow] = useState(false);
    //房屋数据
    const [houseList, setHouseList] = useState([]);

    useEffect(() => {
        initMap();
    },[]);



    //初始化Map地图
    const initMap = async () => {
        //创建地图实例
        const map = new BMap.Map("container");

        window.map = map;
        //获取当前定位城市
        const { label, value } = await CurrentCity();

        //创建地址解析器
        const mapGeo = new BMap.Geocoder();
        //将地址解析结果显示在地图上 , 并调整地图视野
        mapGeo.getPoint(label, async (point) => {
            if (point) {
                map.centerAndZoom(point, 11);
                //比例尺
                map.addControl(new BMap.NavigationControl());
                //缩放控件
                map.addControl(new BMap.ScaleControl());

                //调用 renderOverlays 渲染覆盖物
                renderOverlays(value);
            }
        }, label);
    }

    /**
     * 获取房源数据(获取缩放级别 获取覆盖物类型) getTypeZoom()
     * @param {String} 房源id
     */
    const renderOverlays = async (id) => {
        //获取房源数据 加载提示
        Toast.loading("加载中...", 0, null, false);
        //发起请求 获取房源数据
        const { data } = await axios.get("http://localhost:8080/area/map", { params: { id } });
        //请求完毕后 取消加载提示
        Toast.hide();
        //调用 getTypeAndZoom() 获取缩放级别和覆盖物类型
        const { type, nextLevel } = getTypeAndZoom();
        //遍历房源数据
        data.body.forEach(item => {
            //调用渲染覆盖物的方法 createOverlays();
            createOverlays(type, nextLevel, item);
        })
    }


    /**
     * 获取覆盖物类型 和 缩放级别
     */
    const getTypeAndZoom = () => {
        //计算要绘制的覆盖物类型和下一个缩放级别
        //区 -> 11 , 范围: >= 10 < 12
        //镇 -> 13 , 范围: >= 12 < 14
        //小区 -> 15 , 范围: >= 14 < 16

        //获取当前级别
        const curZoom = window.map.getZoom();
        //声明变量 type nextLevel , 根据缩放级别 依次赋值
        let type, nextLevel;
        //判断当前级别的范围
        if(curZoom >= 10 && curZoom < 12){
            type = "circle";
            nextLevel = 13;
        }else if(curZoom >= 12 && curZoom < 14){
            type = "circle";
            nextLevel = 15;
        }else if(curZoom >= 14 && curZoom < 16){
            type = "rect";
        }
            
        return {
            type,
            nextLevel
        }
    }

    /**
     * 判断渲染覆盖物样式
     * @param {String} type 覆盖物类型 
     * @param {String} level 下一次缩放等级
     * @param {Array} item 房源项数据
     */
    const createOverlays = (type, level, item) => {
        //解构 经纬度 房源数量 区域名称
        const { coord: { latitude, longitude }, count, label, value } = item;
        //覆盖物的坐标
        const point = new BMap.Point(longitude,latitude);
        //判断type类型是否是circle
        switch (type) {
            case "circle":
                //如果是circle , 调用 createCircle() 方法 , 并且传递参数
                createCircle(point, count, label, value, level);
                break;
            case "rect":
                //如果是rect , 调用 createRect()方法 , 并传递参数
                createRect(point, count, label, value);
                break;
        }
    }


    /**
     * 绘制 圆形覆盖物
     * @param {Object} point 覆盖物坐标
     * @param {Number} count 房源数量
     * @param {String} areaName 地区名称
     * @param {String} value 地区id
     * @param {String} level 缩放级别
     */
    const createCircle = (point, count, areaName, value, level) => {
        //添加覆盖物
        const opts = {
            //指定文本标注所在的地理位置
            position: point,
            //设置文本偏移量
            offset: new BMap.Size(35, -35)
        }
        //创建文本标注对象
        const label = new BMap.Label("", opts);
        //给覆盖物 设置内容
        label.setContent(`
            <div class="bubble">
                <p class="name">${areaName}</p>
                <p>${count}套</p>
            </div>
        `)
        //给覆盖物 设置样式
        label.setStyle(labelStyle);
        //当覆盖物点击时(safari中点击不了)
        label.addEventListener("click", (e) => {
            //清除覆盖物(使用定时器setTimeout 来消除 浏览器报错)
            setTimeout(() => {
                window.map.clearOverlays();
            }, 0);
            //渲染新的覆盖物
            renderOverlays(value);
            //设置地图的中心点和放大级别
            //centerAndZoom: 设初始化地图。 
            //如果center类型为Point时，zoom必须赋值，范围3-19级，若调用高清底图（针对移动端开发）时，zoom可赋值范围为3-18级。
            //如果center类型为字符串时，比如“北京”，zoom可以忽略，地图将自动根据center适配最佳zoom级别
            window.map.centerAndZoom(point, level);
        })
        //给地图添加覆盖物
        window.map.addOverlay(label);
    }


    /**
     * 绘制 方形覆盖物
     * @param {Object} point 覆盖物坐标
     * @param {Number} count 房源数量
     * @param {String} areaName 地区名称
     * @param {String} cityId 城市ID
     */
    const createRect = (point, count, areaName, cityId) => {
        //添加覆盖物
        const opts = {
            //指定文本标注所在的地理位置
            position: point,
            //设置文本偏移量
            offset: new BMap.Size(-50, -28)
        }

        //创建文本标注对象
        const label = new BMap.Label("", opts);
        //给覆盖物 设置内容
        label.setContent(`
            <div class="rect">
                <span class="housename">${areaName}</span>
                <span class="housenum">${count}套</span>
                <i class="arrow"></i>
            </div>
        `);
        //给覆盖物设置样式
        label.setStyle(labelStyle);
        //当覆盖物点击时 设置监听事件
        label.addEventListener("click", (e) => {
            //获取当前覆盖物的 X Y 坐标
            const { clientX, clientY } = e.changedTouches[0];

            //获取中心点坐标 X轴取中间值 Y轴取可视范围内的中间值
            //x: window.innerWidth / 2
            //y: (window.innerHeight-330) / 2

            //panBy:将地图在水平位置上移动x像素，垂直位置上移动y像素。
            //如果指定的像素大于可视区域范围或者在配置中指定没有动画效果，则不执行滑动效果
            //将中心点坐标的 X Y 值 减去 当前覆盖物的 X Y轴坐标得到 移动的 X Y 坐标值
            window.map.panBy((window.innerWidth / 2) - clientX, (window.innerHeight - 330) / 2 - clientY);

            getCommunityHouses(cityId);
        })

        //给地图添加覆盖物
        window.map.addOverlay(label);
        window.map.addEventListener("touchstart", () => {
            setIsShow(false);
        })
    }

    //label.addEventListener 不接受异步函数  新建函数获取房屋数据
    const getCommunityHouses = async (cityId) => {
        //显示加载框
        Toast.loading("加载中...", 0, null, false);
        //发起请求 获取房屋数据
        const {data} = await axios.get("http://localhost:8080/houses", {
            params: {
                cityId: cityId,
                start: 1,
                end: 20
            }
        });
        //请求完毕后 隐藏加载框
        Toast.hide();
        //将获取的值存入状态中
        setIsShow(true);
        setHouseList(data.body.list);
    }

    //渲染房屋列表
    const renderHouse = () => {
        return houseList.map(item => (
            <div className="house" key={item.houseCode}>
                <div className="imgWrap" >
                    <img
                        className="img"
                        src={`http://localhost:8080${item.houseImg}`}
                        alt=""
                    />
                </div>
                <div className="content">
                    <h3 className="title">
                        {item.title}
                    </h3>
                    <div className="desc">{item.desc}</div>
                    <div>
                        {
                            item.tags.map((subItem, subIndex) => {
                                let taga = subIndex >= 2 ? "tag3" : `tag${subIndex + 1}`
                                return (<span key={subIndex} className={["tag", taga].join(' ')}>
                                    {subItem}
                                </span>)
                            }
                            )
                        }

                    </div>
                    <div className="price">
                        <span className="priceNum">{item.price}</span> 元/月
                    </div>
                </div>
            </div>))
    }


    return (
        <div className="map">
            {/* navbar */}
            <NavHeader navTitle={navTitle} />

            <div id="container">

            </div>
            <div className={['houseList', isShow ? 'show' : ''].join(' ')}>
                <div className="titleWrap">
                    <h1 className="listTitle">房屋列表</h1>
                    <a className="titleMore" href="/house/list">
                        更多房源
                    </a>
                </div>
                <div className="houseItems">
                    {renderHouse()}
                </div>
            </div>
        </div>
    )
}

export default Map;
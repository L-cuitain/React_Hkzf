# 好客租房 react_hkzf_mobile

## 技术栈
```
React核心库: react , react-dom , react-router-dom , react-router-config , react-hooks
脚手架: create-react-app
数据请求: axios
UI组件库: antd-mobile
其他组件库: react-virtualized(长列表优化) , formik+yup(表单校验) , react-spring(react动画)等
百度地图API
```

## 全局 axios封装

## Page

### - 全局 tabbar

### - 首页 Home
```
轮播图渲染

搜索导航条渲染
-- 左侧城市列表选择 CityList
-- 中间搜索栏
-- 右侧地图 Map

nav导航渲染

group板块渲染

news板块渲染
```

### - 城市列表 CityList
```
nav导航栏渲染

城市列表渲染
-- 左侧根据首字母排列城市
-- 右侧字母索引 点击后跳转到对应位置
```

### - 地图 Map
```
nav导航栏渲染

地图渲染
-- 地图显示房源覆盖物
-- 地图点击房源覆盖物 增加缩放级别 
-- 缩放级别到具体位置 点击显示房屋信息
```

### - 找房 FindHouse
```
搜索栏

筛选菜单
```

## Component

### - 导航栏 NavHeader

### - 搜索栏 SearchHeader

### - 条件筛选菜单 Filter

### - 条件筛选标题组件 FilterTitle

## 实现功能

### - 城市列表渲染
#### CityList.jsx
```
1.1 请求接口 获取 城市列表(citylist) & 热门城市(hotcity)

1.2 将请求数据作为参数传递给 cityFormat 方法中

1.3 将返回的 cityList & cityIndex 添加到状态中

1.4 使用长列表优化 react-virtualized 渲染 城市列表
1.4.1 根据长列表优化中的 AutoSizer & List 标签设置参数与方法
1.4.2 使用文档: https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md

1.5 List标签参数设置
1.5.1 width 宽度
1.5.2 height 列表呈现的高度
1.5.3 rowCount 一共多少行
1.5.4 rowHeight 每行高度
1.5.5 rowRenderer 渲染每一行
1.5.6 onRowsRendered 滚动时拿到相应下标
1.5.7 scrollToAlignment 对齐方式 滚动默认从中间开始

1.6 渲染城市列表索引
```

#### CityFormat.js
```
1.0 封装函数 返回创建好的 cityList & cityIndex

1.1 创建对象 cityList 按字母依次排序保存城市列表

1.2 遍历citylist 获取城市项中的城市首字母

1.3 根据城市首字母 判断cityList对象:
1.3.1 如果对象中不存在此首字母 则添加首字母为键 并把此时遍历的数据项添加到键的值中
1.3.2 如果对象中存在此首字母 则将此时遍历的数据项添加到此键对应的值中

1.4 创建数组(cityIndex) 保存城市列表索引项
1.4.1 获取城市列表对象的键 并根据首字母排序 Object.key() Array.sort() 

1.5 将热门城市的 键 & 值 依次储存到 cityList & cityIndex中

1.6 获取本地储存的地区对象 并将 键 & 值 依次存入 cityList & cityIndex中

1.7 将封装好的 cityList & cityIndex 作为函数返回值返回
```

### - 地图渲染

#### Map.jsx
```                                                 
                           - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                          |                                                                   |
                          |                                                   - - -> 创建区镇级别覆盖物
                         ⬇                                                 | createCircle(point,count,areaName,cityId)
入口 initMap()-->     渲染覆盖物     -->            创建覆盖物                |
                 renderOverlays(id)     createOverlays(type,nextLevel,item) |
                         |                                                  |            
                         |                                                  | - - -> 创建小区级别覆盖物
                        ⬇                                                    createRect(point, count, areaName, cityId)
                  计算类型和缩放级别
                  getTypeAndZoom()
                return{type,nextLevel}

```
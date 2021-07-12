//引入react
import React , {useState , useEffect} from 'react';
//引入样式
import './App.css';

//引入 antd-mobile tabbar组件
import { TabBar } from 'antd-mobile';

//引入路由
import { renderRoutes } from 'react-router-config';


function App(props){
  //创建tabbar组件需要参数
  const [tabbarData,setTabbarData] = useState([
    {
      //键
      key: 'home',
      //标题
      title: '首页',
      //图标
      icon: 'icon-ind',
      //徽标数
      badge: 0,
      //路径
      path: '/home'
    },
    {
      //键
      key: 'findhouse',
      //标题
      title: '找房',
      //图标
      icon: 'icon-findHouse',
      //徽标数
      badge: 0,
      //路径
      path: '/findhouse'
    },
    {
      //键
      key: 'news',
      //标题
      title: '资讯',
      //图标
      icon: 'icon-infom',
      //徽标数
      badge: 0,
      //路径
      path: '/news'
    },
    {
      //键
      key: 'profile',
      //标题
      title: '我的',
      //图标
      icon: 'icon-my',
      //徽标数
      badge: 0,
      //路径
      path: '/profile'
    }
  ]);

  //选中的图标
  const [selectTab , setSelectTab ] = useState(props.history.location.pathname);
  
  //判断是否为tabbar路由
  const [isTab , setIsTab] = useState(false);

  //路由数组
  const [tabRouter , setTabRouter] = useState(['/home','/findhouse','/news','/profile']);

  //生命周期函数
  useEffect(() => {
    //获取此时的路由
    const curProps = props.history.location.pathname;
    
    //判断跳转后的路由与此时路由是否一致
    if(selectTab !== curProps){
      //不一致则 重置路由
      setSelectTab(curProps);
    }

    //判断路由是否为主要页面
    setIsTab(tabRouter.includes(curProps));
  })


  //渲染tabbar
  const applyTabbar = () => {
    return tabbarData.map(item => (
      <TabBar.Item 
        key={item.key} 
        title={item.title}
        icon={<i className={`iconfont ${item.icon}`}></i>}
        selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
        badge={item.badge}
        selected={selectTab === item.path}
        onPress={() => {props.history.push(item.path); setSelectTab(item.path)}}
        >
      </TabBar.Item>
    ))
  }


  return (
    <div className="App">
      {/* 主要功能页面 */}
      {renderRoutes(props.route.routes)}

      {/* tabbar */}
      {
        isTab ? (<div className="tabbar">
          <TabBar tintColor="#33bb82">
            {applyTabbar()}
          </TabBar>
        </div>) : ('')
      }  
    </div>
    
  )
}

export default App;

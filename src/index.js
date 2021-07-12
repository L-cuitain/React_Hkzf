import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//引入antd 样式
import 'antd-mobile/dist/antd-mobile.css';
//引入图标
import './assets/fonts/iconfont.css'
//引入react-virtualized
import 'react-virtualized/styles.css';

//引入hash模式路由
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes/routes';


ReactDOM.render(
  <HashRouter>
      {renderRoutes(routes)}
  </HashRouter>,
  document.getElementById('root')
);

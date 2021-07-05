import { useHistory } from 'react-router-dom';

//引入antd样式
import { NavBar } from 'antd-mobile';

//引入css样式
import './navheader.css';

//引入 prop-types严格类型检查
import PropTypes from 'prop-types';

//导航标题
function NavHeader({ navTitle }) {
    const history = useHistory();

    return (
        <div className="citylist_nav">
            <NavBar
                mode="light"
                icon={<i className="iconfont icon-back"></i>}
                onLeftClick={() => history.goBack()}
            >{navTitle}</NavBar>
        </div>
    )
}

//检查传入参数类型
NavHeader.propTypes = {
    navTitle: PropTypes.string.isRequired
}

export default NavHeader;
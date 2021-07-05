//引入react
import React , {useState , useEffect} from 'react';

//引入走马灯
import { Carousel, Flex, WingBlank, Grid } from 'antd-mobile';

//引入axios
import axios from 'axios';

//引入style
import './Home.css';

// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

//导入搜索组件
import SearchHeader from '../../components/SearchHeader/searchheader';

//导入CurrentCity方法
import CurrentCity from '../../utils/CurrentCity/CurrentCity';

function Home() {

  //轮播图设置参数
  const [swiperData, setSwiperData] = useState({
    // 是否自动切换
    autoplay: true,
    // 是否显示面板指示点
    dots: true,
    // 是否循环播放
    infinite: true,
    // 图片高度
    imgHeight: 212,
  })

  //是否显示轮播图
  const [isFinished, setIsFinished] = useState(false);

  //轮播图图片
  const [swiperImg, setSwiperImg] = useState([]);

  //搜索显示地区
  const [cityName, setCityName] = useState("上海");
  const [areaId , setAreaId] = useState("");

  //租房小组
  const [groups, setGroups] = useState([]);

  //最新资讯
  const [news, setNews] = useState([]);


  //在生命周期中使用方法
  useEffect(() => {
    //调用请求轮播图图片方法
    getSwiperImg();

    //调用请求租房小组方法
    getGroups();

    //调用请求最新资讯方法
    getNews()

    //调用获取搜索城市方法
    getCityName();
  }, [])


  //nav数据
  const [navData, setNavData] = useState([
    {
      id: 1,
      navImg: Nav1,
      navTitle: "整租"
    },
    {
      id: 2,
      navImg: Nav2,
      navTitle: "合租"
    },
    {
      id: 3,
      navImg: Nav3,
      navTitle: "地图找房"
    },
    {
      id: 4,
      navImg: Nav4,
      navTitle: "去出租"
    },
  ]);


  //获取轮播图 图片列表
  const getSwiperImg = async () => {
    //发起请求 获取轮播图图片
    const { data } = await axios.get("http://localhost:8080/home/swiper");
    setSwiperImg(data.body);
    setIsFinished(true);
  }


  //获取搜索城市名称
  const getCityName = async () => {
    //调用方法
    const {label , value} = await CurrentCity();
    setCityName(label);
    setAreaId(value);
  }


  //获取租房小组数据
  const getGroups = async () => {
    //发起请求 获取租房小组数据
    const { data } = await axios.get("http://localhost:8080/home/groups", { area: "AREA|88cff55c-aaa4-e2e0" });
    setGroups(data.body);
  }


  //获取最新资讯数据
  const getNews = async () => {
    //发起请求 获取最新资讯数据
    const { data } = await axios.get("http://localhost:8080/home/news", { area: "AREA|88cff55c-aaa4-e2e0" });
    setNews(data.body);
  }


  //渲染轮播图
  const applySwiper = () => {
    return swiperImg.map(item => (
      <a
        href="https://mobile.ant.design/components/carousel-cn/#components-carousel-demo-basic"
        key={item.id}
        style={{ display: 'inline-block', width: '100%', height: swiperData.imgHeight }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt={item.alt}
          style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        />
      </a>
    ))
  }


  //渲染nav
  const applyNav = () => {
    return navData.map(item => (
      <Flex.Item key={item.id} style={{ textAlign: 'center' }}>
        <img src={item.navImg} alt="" />
        <h2>{item.navTitle}</h2>
      </Flex.Item>
    ))
  }


  //渲染租房小组
  const applyNews = () => {
    return news.map(item => (
      <div className="news-item" key={item.id}>
        {/* news img */}
        <div className="imgwrap">
          <img className="img" src={`http://localhost:8080${item.imgSrc}`} alt="" />
        </div>
        {/* news title */}
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }


  return (
    <div>
      {/* swiper */}
      <div className="swiper">
        {/* search */}
        <SearchHeader cityName={cityName}/>

        {/* swiper */}
        {
          isFinished ? <Carousel
            // 是否自动切换
            autoplay={swiperData.autoplay}
            // 是否显示面板指示点
            dots={swiperData.dots}
            // 是否循环播放
            infinite={swiperData.infinite}
          >
            {applySwiper()}
          </Carousel> : ('')
        }
      </div>


      {/* nav */}
      <Flex className="nav">
        {applyNav()}
      </Flex>


      {/* groups */}
      <div className="group">
        {/* groups title */}
        <Flex justify="between">
          <h4 className="group-title">租房小组</h4>
          <span>更多</span>
        </Flex>


        {/* groups grid  */}
        <Grid
          hasLine="false"
          data={groups}
          columnNum={2}
          hasLine={false}
          itemStyle={{ height: '75px' }}
          renderItem={item => (
            <Flex className="group-item" justify="around" key={item.id}>
              <div className="desc">
                <h3 className="title">{item.title}</h3>
                <span className="info">{item.desc}</span>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )} />
      </div>


      {/* news */}
      <div className="news">
        {/* news title */}
        <h4 className="group-title">最新资讯</h4>

        {/* news content */}
        <WingBlank size="md">
          {applyNews()}
        </WingBlank>
      </div>

    </div>
  )
}

export default Home;
// 这是天气api的地址
const WEATHER_BASE_URL = 'https://my-weather12138.herokuapp.com/';

// 获取省和市输入框的DOM元素
const provinceElement = document.querySelector("#province");
const cityElement = document.querySelector("#city");

// 生成请求的URL，其中type可以是forecast_1h|forecast_24h|index|alarm|limit|tips
const createWeatherUrl = (type = "forecast_24h", province, city) => `${WEATHER_BASE_URL}?source=xw&weather_type=${type}&province=${province}&city=${city}`;

/**
 * 
 * @param {元素内部的HTML} innerHTML 
 * @param {元素标签名} tagName 
 * @param {元素的样式} style 
 */
function createElement(innerHTML,tagName="span",style="margin: 0 1rem 0 1rem;") {
  const element = document.createElement(tagName);
  element.innerHTML = innerHTML;
  element.style = style;
  return element;
}

class WeatherItem {
  /**
   * @param {一个包含天气信息的Object} weatherItem 
   * @param {元素类名} classNames 
   * @param {元素样式} style 
   *  这是JavaScript中的类
   */
  constructor(weatherItem, classNames, style) {
    /**
     * 这是JavaScript的对象结构,很有用的。
     * 下面这行代码作用类似 
     * const day_weather = weatherItem.day_weather;
     * 以此类推
     */
    const { day_weather, night_weather, min_degree, max_degree, time } = weatherItem;
    this.dayWeather = day_weather;
    this.nightWeather = night_weather;
    this.minDegree = min_degree;
    this.maxDegree = max_degree;
    this.time = time;
    this.classNames = classNames;
    this.style = style;
  }

  toHTMLElement() {
    const element = document.createElement('li');
    element.appendChild(createElement(`日间天气：${this.dayWeather}`));
    element.appendChild(createElement(`夜间天气：${this.nightWeather}`));
    element.appendChild(createElement(`最低温度：${this.minDegree}℃`));
    element.appendChild(createElement(`最高温度：${this.maxDegree}℃`));
    element.appendChild(createElement(`时间：${this.time}`));

    // 如果存在类名或者样式，就往创建的这个元素添加
    if (this.classNames) {
      element.classList.add(...this.classNames.split(" "));
    }
    if (this.style) {
      element.style = this.style;
    }
    return element;
  }
}

/**
 * 处理用于用户点击查询
 * async,await和JavaScript异步有关
 * 想了解的同学可以看这个 https://juejin.im/post/5c30375851882525ec200027
 */
async function handleFetchWeather() {
  // 创建新的 displayContainer
  const newDisplayContainer = document.createElement('ol');
  newDisplayContainer.id = "display-container";

  // 获取inputContainer
  const inputContainer = document.querySelector("#input-container");

  // 添加inputContainer闪烁效果
  inputContainer.classList.remove("my-shake");
  inputContainer.classList.add("flash-infinite");

  // 想后端发送请求
  const response = await fetch(createWeatherUrl("forecast_24h", provinceElement.value, cityElement.value));
  
  // 解析数据
  const data = await response.json();
  
  // 收到请求的响应后停止闪烁
  inputContainer.classList.remove("flash-infinite");

  // 如果查询的这个省和城市没有天气信息就会有抖动效果
  if (!data.data || !data.data.forecast_24h || !data.data.forecast_24h["0"]) {
    inputContainer.classList.remove("my-shake");
    setTimeout(() => {
      inputContainer.classList.add("my-shake");
    }, 300);
    return;
  }

  /**
   * 遍历数组往新的displayContainer添加元素
   * Object.values() 参考这个 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values
   */
  Object.values(data.data.forecast_24h).forEach((item, index) => {
    const weatherItem = new WeatherItem(item, "animated bounceInUp", `animation-duration:${index*1 + 7}00ms;`);
    newDisplayContainer.appendChild(weatherItem.toHTMLElement());
  })
  
  // 移除旧的displayContainer，往#app添加新的displayContainer
  document.querySelector("#display-container").remove();
  document.querySelector("#app").appendChild(newDisplayContainer);
}
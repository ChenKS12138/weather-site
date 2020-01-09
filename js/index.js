import { createElement,createAnimation } from './shared/util.js';
import { requestWeatherDays } from './shared/api.js';

// 获取省和市输入框的DOM元素
const provinceElement = document.querySelector("#province");
const cityElement = document.querySelector("#city");

class WeatherItem {
  constructor(weatherInfo) {
    this.info = weatherInfo;
    this.element = document.createElement('li');
  }
  addClassName(className) {
    this.element.classList.add(className);
    return this;
  }
  setStyle(style) {
    this.element.style = style;
    return this;
  }
  toHTMLElement() {
    const { day_weather, night_weather, min_degree, max_degree, time } = this.info;
    this.element.appendChild(createElement(`日间天气：${day_weather}`));
    this.element.appendChild(createElement(`夜间天气：${night_weather}`));
    this.element.appendChild(createElement(`最低温度：${min_degree}℃`));
    this.element.appendChild(createElement(`最高温度：${max_degree}℃`));
    this.element.appendChild(createElement(`时间：${time}`));
    return this.element;
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

  const inputContainer = document.querySelector("#input-container");
  const stopFlashAnimation = createAnimation(inputContainer, "flash-infinite");
  const data = await requestWeatherDays(provinceElement.value,cityElement.value);
  
  // 收到请求的响应后停止闪烁
  stopFlashAnimation();

  // 如果查询的这个省和城市没有天气信息就会有抖动效果
  if (!data.data || !data.data.forecast_24h || !data.data.forecast_24h["0"]) {
    createAnimation(inputContainer, "my-shake", 300);
    return;
  }

  /**
   * 遍历数组往新的displayContainer添加元素
   * Object.values() 参考这个 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values
   */
  Object.values(data.data.forecast_24h).forEach((item, index) => {
    const weatherItem = new WeatherItem(item);
    weatherItem.addClassName("animated")
      .addClassName("bounceInUp")
      .setStyle(`animation-duration:${index * 1 + 7}00ms;`);
    newDisplayContainer.appendChild(weatherItem.toHTMLElement());
  })
  
  // 移除旧的displayContainer，往#app添加新的displayContainer
  document.querySelector("#display-container").remove();
  document.querySelector("#app").appendChild(newDisplayContainer);
}

document.querySelector("#btn_query").addEventListener("click", handleFetchWeather);
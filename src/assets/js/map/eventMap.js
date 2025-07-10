/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2020-11-09 15:42:05
 * @LastEditors: wys
 * @LastEditTime: 2020-12-17 10:43:59
 */
export const eventMap = {
  gas: '气',
  fire: '火',
  camera: '摄',
};

export const layerMap = {
  Tunnel: 'sd',
  Tollbooth: 'SFZ_1',
};

export const eventLevel = [
  {
    id: 1,
    name: '一级',
    color: '#FF001F',
  }, {
    id: 2,
    name: '二级',
    color: '#E6BD45',
  }, {
    id: 3,
    name: '普通',
    color: '#00FFEA',
  },
];

// 设备类型简称 
export const decviceShortName=[
  {
    type: 'Lamp',
    name: '调光'
  }, {
    type: 'WeatherDetector',
    name: '气象'
  }, {
    type: 'PoisonousGasDetector',
    name: '气体'
  },{
    type: 'CCoverPlate',
    name: '盖板'
  },{
    type: 'ConeTank',
    name: '交安'
  },{
    type: 'EnvDetector',
    name: '环境'
  },{
    type: 'SmartSapientPlate',
    name: '盖板'
  },{
    type: 'Spike',
    name: '道钉'
  },{
    type: 'DeviceMonitorSensor',
    name: '机电' 
  },{
    type: 'Gateway',
    name: '网关'
  },{
    type: 'Relay',
    name: '中继'
  },{
    type: 'LocalController',
    name: '光强'
  },{
    type: 'DoorDetector',
    name: '门状'
  }
  ,{
    type: 'GuideSign',
    name: '智慧诱导标'
  }
]
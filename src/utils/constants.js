/**
 * 常量定义
 * 
 * 集中管理应用中的所有常量，便于维护和修改
 * 
 * @module constants
 */

/**
 * 画布默认参数
 */
export const CANVAS_DEFAULTS = {
  // 初始缩放倍数
  DEFAULT_ZOOM: 1,
  // 最小缩放倍数
  MIN_ZOOM: 0.2,
  // 最大缩放倍数
  MAX_ZOOM: 3,
  // 缩放步长（滚轮）
  ZOOM_STEP: 1.2,
  // 初始平移
  DEFAULT_PAN: { x: 0, y: 0 }
};

/**
 * 节点默认参数
 */
export const NODE_DEFAULTS = {
  // 节点默认宽度
  WIDTH: 280,
  // 节点内容区域始点 Y 坐标
  CONTENT_START_Y: 55,
  // 端口间距
  PORT_SPACING: 35,
  // 节点默认位置
  DEFAULT_POSITION: { x: 100, y: 100 }
};

/**
 * 连接线参数
 */
export const CONNECTION_DEFAULTS = {
  // 连接线颜色
  COLOR: '#ffa500',
  // 连接线宽度
  STROKE_WIDTH: 2,
  // 连接线虚线样式
  DASH_ARRAY: '5,5',
  // 删除按钮半径
  DELETE_BUTTON_RADIUS: 12,
  // 连接线悬停检测范围
  HOVER_DETECTION_WIDTH: 12
};

/**
 * 支持的模块类别列表
 * 与 moduleNodes/*.json 文件名对应
 */
export const MODULE_CATEGORIES = [
  'basic',
  'marketing',
  'routine',
  'technology',
  'finance',
  'hr',
  'memes'
];

/**
 * 节点类型定义
 */
export const NODE_TYPES = {
  // 文本输入节点
  TEXT_INPUT: 'textinput',
  // 图片输入节点
  IMAGE_INPUT: 'imageinput',
  // 数据输入节点
  DATA_INPUT: 'datainput',
  // 输出节点
  OUTPUT: 'output',
  // 普通分析节点
  ANALYSIS: 'analysis',
  // 模板节点
  TEMPLATE: 'template'
};

/**
 * 文件上传接受的类型
 */
export const FILE_ACCEPT_TYPES = {
  image: 'image/*',
  data: '.csv,.json,.xlsx,.xls,.txt'
};

/**
 * 按钮样式常量
 */
export const BUTTON_STYLES = {
  primary: {
    padding: '8px 12px',
    fontSize: '16px',
    backgroundColor: '#ffa500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  secondary: {
    padding: '6px 10px',
    fontSize: '14px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

/**
 * 调试模式开关
 */
export const DEBUG_MODE = process.env.NODE_ENV === 'development';

/**
 * 动画时间配置（毫秒）
 */
export const ANIMATION_DURATION = {
  SHORT: 200,
  NORMAL: 300,
  LONG: 500
};

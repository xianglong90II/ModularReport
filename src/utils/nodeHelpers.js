/**
 * 节点操作辅助函数
 * 
 * 提供与节点操作相关的工具函数
 * 
 * @module nodeHelpers
 */

/**
 * 生成唯一的节点实例 ID
 * 
 * 格式：${moduleId}-${counter}
 * 例如：TEXT_INPUT-0, SWOT-1
 * 
 * @param {String} moduleId - 模块的 ID
 * @param {Number} counter - 计数器
 * @returns {String} 唯一的节点实例 ID
 */
export function generateNodeInstanceId(moduleId, counter) {
  return `${moduleId}-${counter}`;
}

/**
 * 根据模块创建新节点
 * 
 * @param {Object} module - 模块定义对象
 * @param {Number} counter - 节点计数器
 * @param {Object} position - 节点位置 {x, y}
 * @returns {Object} 新节点对象
 */
export function createNodeFromModule(module, counter, position = { x: 100, y: 100 }) {
  return {
    // 从模块继承所有属性
    ...module,
    // 生成唯一的实例 ID
    nodeInstanceId: generateNodeInstanceId(module.id, counter),
    // 设置初始位置
    position
  };
}

/**
 * 更新节点位置
 * 
 * @param {Array} nodes - 所有节点数组
 * @param {String} nodeInstanceId - 目标节点 ID
 * @param {Object} position - 新位置 {x, y}
 * @returns {Array} 更新后的节点数组
 */
export function updateNodePosition(nodes, nodeInstanceId, position) {
  return nodes.map(n =>
    n.nodeInstanceId === nodeInstanceId
      ? { ...n, position }
      : n
  );
}

/**
 * 删除节点及其相关连接
 * 
 * @param {Array} nodes - 所有节点数组
 * @param {Array} connections - 所有连接数组
 * @param {String} nodeInstanceId - 要删除的节点 ID
 * @returns {Object} {nodes, connections} 更新后的数组对
 */
export function deleteNodeWithConnections(nodes, connections, nodeInstanceId) {
  // 移除该节点
  const filteredNodes = nodes.filter(n => n.nodeInstanceId !== nodeInstanceId);
  
  // 移除所有与该节点相关的连接
  const filteredConnections = connections.filter(
    conn => conn.from.nodeId !== nodeInstanceId && conn.to.nodeId !== nodeInstanceId
  );
  
  return {
    nodes: filteredNodes,
    connections: filteredConnections
  };
}

/**
 * 获取连接到指定节点的输入连接
 * 
 * @param {Array} connections - 所有连接数组
 * @param {String} nodeInstanceId - 节点 ID
 * @returns {Array} 输入连接数组
 */
export function getInputConnections(connections, nodeInstanceId) {
  return connections.filter(conn => conn.to.nodeId === nodeInstanceId);
}

/**
 * 获取从指定节点发出的输出连接
 * 
 * @param {Array} connections - 所有连接数组
 * @param {String} nodeInstanceId - 节点 ID
 * @returns {Array} 输出连接数组
 */
export function getOutputConnections(connections, nodeInstanceId) {
  return connections.filter(conn => conn.from.nodeId === nodeInstanceId);
}

/**
 * 检查两个端口是否已连接
 * 
 * @param {Array} connections - 所有连接数组
 * @param {String} fromNodeId - 源节点 ID
 * @param {Number} outputIdx - 输出端口索引
 * @param {String} toNodeId - 目标节点 ID
 * @param {Number} inputIdx - 输入端口索引
 * @returns {Boolean} 是否已连接
 */
export function isPortConnected(connections, fromNodeId, outputIdx, toNodeId, inputIdx) {
  return connections.some(
    conn =>
      conn.from.nodeId === fromNodeId &&
      conn.from.outputIdx === outputIdx &&
      conn.to.nodeId === toNodeId &&
      conn.to.inputIdx === inputIdx
  );
}

/**
 * 根据连接的输出端口计算占位符选择器
 * 
 * 示例：
 * - outputIndices = [0, 2], placeholders = ["S", "W", "O", "T"]
 * - 返回 "SO"
 * 
 * @param {Array<Number>} outputIndices - 连接的输出端口索引数组
 * @param {Array<String>} placeholders - 节点的占位符数组
 * @returns {String|null} 占位符选择器，如果无法生成返回 null
 */
export function computePlaceholderSelector(outputIndices, placeholders) {
  if (!placeholders || placeholders.length === 0 || !outputIndices || outputIndices.length === 0) {
    return null;
  }
  
  let selector = '';
  // 按索引顺序添加占位符
  outputIndices.sort((a, b) => a - b).forEach(idx => {
    if (idx < placeholders.length) {
      selector += placeholders[idx];
    }
  });
  
  return selector || null;
}

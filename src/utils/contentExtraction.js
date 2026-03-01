/**
 * 内容提取工具函数
 * 
 * 提供占位符提取、内容合并等核心逻辑
 * 
 * @module contentExtraction
 */

/**
 * 从文本中提取指定占位符的内容
 * 
 * 原理：
 * 1. 将 selector 按占位符列表解析成占位符数组
 * 2. 对每个占位符使用正则表达式提取内容
 * 3. 将提取的内容用 '\n\n' 连接
 * 
 * 示例：
 * ```
 * extractPlaceholderContent(
 *   "[S] Strengths info [W] Weakness info [O] Opportunity",
 *   "SWO",
 *   ["S", "W", "O", "T"]
 * )
 * // 返回: "Strengths info\n\nWeakness info\n\nOpportunity"
 * ```
 * 
 * @param {String} prompt - 包含占位符的原始文本
 * @param {String} selector - 占位符选择器，如 "S" 或 "SWOT"
 * @param {Array<String>} placeholdersList - 有效占位符列表，如 ["S","W","O","T"]
 * @returns {String} 提取出的内容，如果无法匹配返回原始文本
 */
export function extractPlaceholderContent(prompt, selector, placeholdersList = null) {
  // 参数验证：如果 selector 或 prompt 无效，直接返回原始内容
  if (!selector || !prompt) return prompt;
  
  // 第一步：确定要提取的占位符
  let placeholdersToExtract = [];
  
  if (placeholdersList && placeholdersList.length > 0) {
    // 逐个检查占位符列表，找到在 selector 中的占位符
    // 这样可以支持多字符占位符（如 "En", "Tech"）
    let remainingSelector = selector;
    placeholdersList.forEach(placeholder => {
      // 检查 selector 是否以该占位符开头
      if (remainingSelector.startsWith(placeholder)) {
        placeholdersToExtract.push(placeholder);
        remainingSelector = remainingSelector.substring(placeholder.length);
      }
    });
    
    // 如果无法通过占位符列表匹配，回退到字符级别匹配
    if (placeholdersToExtract.length === 0) {
      placeholdersToExtract = selector.split('');
    }
  } else {
    // 如果没有占位符列表，直接按字符分割
    placeholdersToExtract = selector.split('');
  }
  
  // 第二步：逐个提取占位符对应的内容
  let result = '';
  placeholdersToExtract.forEach(placeholder => {
    // 转义正则表达式特殊字符，防止出错
    const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 构造正则表达式模式
    // \[占位符\] 匹配占位符本身
    // ([^\[]*?) 非贪心匹配占位符后的内容（到下一个 [ 或文本末尾）
    // (?=\[|$) 正向前瞻，确保到达下一个 [ 或字符串末尾
    const pattern = new RegExp(`\\[${escapedPlaceholder}\\]([^\\[]*?)(?=\\[|$)`, 'gs');
    const match = pattern.exec(prompt);
    
    // 如果找到匹配，添加到结果
    if (match) {
      // .trim() 移除多余的空白
      result += (result ? '\n\n' : '') + match[1].trim();
    }
  });
  
  // 如果成功提取到内容返回结果，否则返回原始文本
  return result || prompt;
}

/**
 * 获取节点的完整内容，包括所有上游节点
 * 
 * 工作流程：
 * 1. 递归查找所有连接到该节点的上游节点
 * 2. 收集上游节点的内容（应用占位符提取）
 * 3. 拼接：上游内容 → 当前节点内容
 * 
 * 占位符覆盖机制：
 * - 如果节点有连接的输出端口，自动计算应该提取哪些占位符
 * - 例如：连接输出端口 0(S) 和 2(O)，则自动提取 "SO"
 * - 这样可以实现内容的智能复用和组织
 * 
 * @param {String} nodeInstanceId - 节点实例 ID
 * @param {Array} nodes - 所有节点数组
 * @param {Array} connections - 所有连接数组
 * @param {Object} nodeInputValues - 节点输入值映射
 * @param {Set} visited - 已访问的节点集合，用于防止无限递归
 * @param {String} outputPortOverride - 占位符选择器覆盖值
 * @returns {String} 组合后的完整内容
 */
export function getNodeFullContent(
  nodeInstanceId,
  nodes,
  connections,
  nodeInputValues,
  visited = new Set(),
  outputPortOverride = null
) {
  // 防止无限循环：检查该节点是否已访问过
  if (visited.has(nodeInstanceId)) return '';
  visited.add(nodeInstanceId);

  // 查找所有指向该节点的连接（上游输入）
  const inputConnections = connections.filter(
    conn => conn.to.nodeId === nodeInstanceId
  );
  
  // 获取当前节点对象
  const currentNode = nodes.find(n => n.nodeInstanceId === nodeInstanceId);
  if (!currentNode) return '';
  
  // 情况 1：没有上游连接，只返回当前节点的内容
  if (inputConnections.length === 0) {
    // 获取该节点的内容
    let ownPart = currentNode.defaultPrompt;
    
    // 特殊处理：文本输入节点使用用户输入的值
    if (currentNode.type === 'textinput') {
      const txt = nodeInputValues[nodeInstanceId];
      if (txt) ownPart = txt;
    } 
    // 如果指定了占位符覆盖，提取对应内容
    else if (outputPortOverride && currentNode.defaultPrompt.includes('[')) {
      ownPart = extractPlaceholderContent(
        currentNode.defaultPrompt,
        outputPortOverride,
        currentNode.placeholders
      );
    }
    
    return ownPart;
  }
  
  // 情况 2：有上游连接，递归获取上游内容
  let fullContent = '';
  
  // 按源节点分组连接，处理一个源节点的多个输出
  const connectionsBySource = {};
  inputConnections.forEach(conn => {
    if (!connectionsBySource[conn.from.nodeId]) {
      connectionsBySource[conn.from.nodeId] = [];
    }
    connectionsBySource[conn.from.nodeId].push(conn.from.outputIdx);
  });
  
  // 遍历每个上游节点，获取其内容
  Object.entries(connectionsBySource).forEach(([sourceNodeId, outputIndices]) => {
    const sourceNode = nodes.find(n => n.nodeInstanceId === sourceNodeId);
    if (sourceNode) {
      // 确定该上游节点的占位符覆盖
      // 将连接的输出端口索引转换为占位符字符串
      let upstreamOverride = null;
      if (sourceNode.placeholders && sourceNode.placeholders.length > 0) {
        let placeholderStr = '';
        // 按索引顺序添加占位符
        outputIndices.sort((a, b) => a - b).forEach(outputIdx => {
          if (outputIdx < sourceNode.placeholders.length) {
            placeholderStr += sourceNode.placeholders[outputIdx];
          }
        });
        if (placeholderStr) {
          upstreamOverride = placeholderStr;
        }
      }
      
      // 递归获取上游节点的完整内容
      const upstreamContent = getNodeFullContent(
        sourceNodeId,
        nodes,
        connections,
        nodeInputValues,
        new Set(visited),
        upstreamOverride
      );
      
      if (upstreamContent) {
        fullContent += upstreamContent + '\n\n';
      }
    }
  });
  
  // 添加当前节点的内容
  let ownPart = currentNode.defaultPrompt;
  if (currentNode.type === 'textinput') {
    const txt = nodeInputValues[nodeInstanceId];
    if (txt) ownPart = txt;
  } else if (outputPortOverride && currentNode.defaultPrompt.includes('[')) {
    ownPart = extractPlaceholderContent(
      currentNode.defaultPrompt,
      outputPortOverride,
      currentNode.placeholders
    );
  }
  fullContent += ownPart;
  
  return fullContent.trim();
}

/**
 * 从输出节点获取最终组合内容
 * 
 * @param {String} outputNodeInstanceId - 输出节点的实例 ID
 * @param {Array} nodes - 所有节点数组
 * @param {Array} connections - 所有连接数组
 * @param {Object} nodeInputValues - 节点输入值映射
 * @returns {Object} 格式化的输出对象 {name, defaultPrompt}
 */
export function getOutputNodeContent(
  outputNodeInstanceId,
  nodes,
  connections,
  nodeInputValues
) {
  const fullContent = getNodeFullContent(
    outputNodeInstanceId,
    nodes,
    connections,
    nodeInputValues
  );
  
  return {
    name: 'Final Output',
    defaultPrompt: fullContent || 'No content connected yet'
  };
}

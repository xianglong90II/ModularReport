/**
 * 节点管理 Hook
 * 
 * 提供节点的创建、删除、移动等操作的自定义 Hook
 * 
 * @module useNodeManagement
 */

import { useState, useCallback } from 'react';
import { 
  createNodeFromModule,
  updateNodePosition,
  deleteNodeWithConnections 
} from '../utils/nodeHelpers';

/**
 * 自定义 Hook：节点管理
 * 
 * 提供节点相关的状态和操作函数
 * 
 * @returns {Object} {
 *   nodes,              // 节点数组
 *   nodeCounter,        // 节点计数器
 *   addNode,            // 添加节点
 *   removeNode,         // 删除节点
 *   moveNode,           // 移动节点
 *   addNodeAndUpdateCounter
 * }
 */
export function useNodeManagement() {
  const [nodes, setNodes] = useState([]);
  const [nodeCounter, setNodeCounter] = useState(0);

  /**
   * 添加新节点
   */
  const addNode = useCallback((module, position = null) => {
    if (!module) return;
    
    const newNode = createNodeFromModule(
      module,
      nodeCounter,
      position || { x: 100, y: 100 }
    );
    
    setNodes(prev => [...prev, newNode]);
    setNodeCounter(prev => prev + 1);
    
    return newNode;
  }, [nodeCounter]);

  /**
   * 删除节点
   * 注意：这只删除节点，不删除连接（应在上层处理）
   */
  const removeNode = useCallback((nodeInstanceId) => {
    setNodes(prev => prev.filter(n => n.nodeInstanceId !== nodeInstanceId));
  }, []);

  /**
   * 移动节点
   */
  const moveNode = useCallback((nodeInstanceId, position) => {
    setNodes(prev => updateNodePosition(prev, nodeInstanceId, position));
  }, []);

  return {
    nodes,
    nodeCounter,
    addNode,
    removeNode,
    moveNode
  };
}

/**
 * 自定义 Hook：连接管理
 * 
 * 提供连接的创建、删除等操作的自定义 Hook
 * 
 * @returns {Object} {
 *   connections,        // 连接数组
 *   addConnection,      // 添加连接
 *   removeConnection,   // 删除连接
 *   clearConnections
 * }
 */
export function useConnectionManagement() {
  const [connections, setConnections] = useState([]);

  /**
   * 添加新连接
   */
  const addConnection = useCallback((fromNodeId, outputIdx, toNodeId, inputIdx) => {
    const newConnection = {
      from: { nodeId: fromNodeId, outputIdx },
      to: { nodeId: toNodeId, inputIdx }
    };
    
    setConnections(prev => [...prev, newConnection]);
    return newConnection;
  }, []);

  /**
   * 删除连接
   */
  const removeConnection = useCallback((connectionIndex) => {
    setConnections(prev => prev.filter((_, idx) => idx !== connectionIndex));
  }, []);

  /**
   * 清空所有连接
   */
  const clearConnections = useCallback(() => {
    setConnections([]);
  }, []);

  return {
    connections,
    addConnection,
    removeConnection,
    clearConnections,
    setConnections
  };
}

/**
 * 自定义 Hook：节点输入值管理
 * 
 * 管理各节点的用户输入值（如文本输入框内容）
 * 
 * @returns {Object} {
 *   nodeInputValues,    // 输入值映射
 *   updateInputValue,   // 更新输入值
 *   clearInputValue,    // 清空输入值
 *   clearAllInputValues
 * }
 */
export function useNodeInputValues() {
  const [nodeInputValues, setNodeInputValues] = useState({});

  /**
   * 更新节点的输入值
   */
  const updateInputValue = useCallback((nodeInstanceId, value) => {
    setNodeInputValues(prev => ({
      ...prev,
      [nodeInstanceId]: value
    }));
  }, []);

  /**
   * 清空特定节点的输入值
   */
  const clearInputValue = useCallback((nodeInstanceId) => {
    setNodeInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[nodeInstanceId];
      return newValues;
    });
  }, []);

  /**
   * 清空所有输入值
   */
  const clearAllInputValues = useCallback(() => {
    setNodeInputValues({});
  }, []);

  return {
    nodeInputValues,
    updateInputValue,
    clearInputValue,
    clearAllInputValues
  };
}

/**
 * 自定义 Hook：选中状态管理
 * 
 * @returns {Object} {
 *   selectedId,         // 当前选中的 ID
 *   setSelectedId,      // 设置选中 ID
 *   clearSelection
 * }
 */
export function useSelection() {
  const [selectedId, setSelectedId] = useState(null);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
    setSelectedId,
    clearSelection
  };
}

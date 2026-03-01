/**
 * 画布状态管理 Hook
 * 
 * 提供画布的缩放、平移等操作的自定义 Hook
 * 
 * @module useCanvasState
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { CANVAS_DEFAULTS } from '../utils/constants';

/**
 * 自定义 Hook：画布状态和操作
 * 
 * 管理画布的缩放、平移、拖拽等交互状态
 * 
 * @returns {Object} 完整的画布状态和操作接口
 */
export function useCanvasState() {
  // ==== 画布变换状态 ====
  const [canvasPan, setCanvasPan] = useState(CANVAS_DEFAULTS.DEFAULT_PAN);
  const [canvasZoom, setCanvasZoom] = useState(CANVAS_DEFAULTS.DEFAULT_ZOOM);
  const [isCanvasPanning, setIsCanvasPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showZoomPercentage, setShowZoomPercentage] = useState(false);

  // ==== 节点拖拽状态 ====
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ==== 连接状态 ====
  const [connectionStart, setConnectionStart] = useState(null);
  const [temporaryLine, setTemporaryLine] = useState(null);
  const [hoveredConnectionIdx, setHoveredConnectionIdx] = useState(null);

  // ==== Refs 用于在事件处理器中访问最新状态 ====
  const canvasPanRef = useRef(canvasPan);
  const canvasZoomRef = useRef(canvasZoom);
  const isCanvasPanningRef = useRef(isCanvasPanning);
  const panStartRef = useRef(panStart);

  /**
   * 同步 Refs 和状态
   */
  useEffect(() => {
    canvasPanRef.current = canvasPan;
    canvasZoomRef.current = canvasZoom;
    isCanvasPanningRef.current = isCanvasPanning;
    panStartRef.current = panStart;
  }, [canvasPan, canvasZoom, isCanvasPanning, panStart]);

  // ==== 缩放操作 ====
  
  /**
   * 缩放画布
   */
  const handleZoom = useCallback((direction) => {
    setCanvasZoom(prev => {
      let newZoom;
      if (direction === 'in') {
        newZoom = Math.min(prev * CANVAS_DEFAULTS.ZOOM_STEP, CANVAS_DEFAULTS.MAX_ZOOM);
      } else {
        newZoom = Math.max(prev / CANVAS_DEFAULTS.ZOOM_STEP, CANVAS_DEFAULTS.MIN_ZOOM);
      }
      
      // 显示缩放百分比
      setShowZoomPercentage(true);
      const timeoutId = setTimeout(() => setShowZoomPercentage(false), 1500);
      
      return newZoom;
    });
  }, []);

  /**
   * 重置画布（缩放和平移）
   */
  const resetCanvas = useCallback(() => {
    setCanvasZoom(CANVAS_DEFAULTS.DEFAULT_ZOOM);
    setCanvasPan(CANVAS_DEFAULTS.DEFAULT_PAN);
  }, []);

  // ==== 平移操作 ====
  
  /**
   * 开始平移
   */
  const startPan = useCallback((x, y) => {
    setIsCanvasPanning(true);
    setPanStart({ x, y });
  }, []);

  /**
   * 停止平移
   */
  const stopPan = useCallback(() => {
    setIsCanvasPanning(false);
  }, []);

  /**
   * 进行平移
   */
  const doPan = useCallback((currentX, currentY) => {
    setCanvasPan(prev => ({
      x: prev.x + (currentX - panStartRef.current.x),
      y: prev.y + (currentY - panStartRef.current.y)
    }));
    setPanStart({ x: currentX, y: currentY });
  }, []);

  // ==== 节点拖拽操作 ====
  
  /**
   * 开始拖拽节点
   */
  const startDragging = useCallback((nodeId, x, y) => {
    setIsDragging(true);
    setDraggedNode(nodeId);
  }, []);

  /**
   * 停止拖拽节点
   */
  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // ==== 连接操作 ====
  
  /**
   * 开始创建连接
   */
  const startConnection = useCallback((nodeId, outputIdx, x, y) => {
    setConnectionStart({ nodeId, outputIdx, x, y });
  }, []);

  /**
   * 停止创建连接
   */
  const cancelConnection = useCallback(() => {
    setConnectionStart(null);
    setTemporaryLine(null);
  }, []);

  /**
   * 更新临时连接线（拖拽过程中）
   */
  const updateTemporaryLine = useCallback((endX, endY) => {
    if (connectionStart) {
      setTemporaryLine({
        startX: connectionStart.x,
        startY: connectionStart.y,
        endX,
        endY
      });
    }
  }, [connectionStart]);

  // ==== 状态重置 ====
  
  /**
   * 清空所有交互状态
   */
  const clearAllState = useCallback(() => {
    setCanvasPan(CANVAS_DEFAULTS.DEFAULT_PAN);
    setCanvasZoom(CANVAS_DEFAULTS.DEFAULT_ZOOM);
    setIsCanvasPanning(false);
    setIsDragging(false);
    setDraggedNode(null);
    setConnectionStart(null);
    setTemporaryLine(null);
    setHoveredConnectionIdx(null);
  }, []);

  return {
    // 画布变换
    canvasPan,
    canvasZoom,
    isCanvasPanning,
    showZoomPercentage,

    // 节点拖拽
    isDragging,
    draggedNode,
    dragOffset,

    // 连接
    connectionStart,
    temporaryLine,
    hoveredConnectionIdx,

    // 缩放操作
    handleZoom,
    resetCanvas,
    setCanvasZoom,

    // 平移操作
    startPan,
    stopPan,
    doPan,
    setCanvasPan,

    // 节点拖拽操作
    startDragging,
    stopDragging,
    setDragOffset,
    setDraggedNode,

    // 连接操作
    startConnection,
    cancelConnection,
    updateTemporaryLine,
    setConnectionStart,
    setTemporaryLine,

    // 悬停状态
    setHoveredConnectionIdx,

    // Refs（用于事件处理器）
    canvasPanRef,
    canvasZoomRef,
    isCanvasPanningRef,
    panStartRef,

    // 状态重置
    clearAllState
  };
}

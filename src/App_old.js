/**
 * ModularReport - 模块化报告生成系统
 * 
 * 主应用组件 - 应用的入口和状态管理中心
 * 
 * 职责：
 * - 管理所有模块加载
 * - 管理节点、连接、输入值等全局状态
 * - 调度子组件和处理回调
 * - 实现内容提取和输出逻辑
 * 
 * @author ModularReport Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import Toolbar from './components/Toolbar';
import PromptPreview from './components/PromptPreview';
import ModuleLibrary from './components/ModuleLibrary';
import NodeCanvas from './components/NodeCanvas';

function ModuleLibrary({ isExpanded, modules, selectedId, onSelectionChange }) {
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Get all unique tags from modules
  const allTags = [...new Set(modules.flatMap(m => m.tags || []))].sort();

  // Filter modules based on search text and selected tags
  const filteredModules = modules.filter(module => {
    const matchesSearch = !searchText || 
      module.name.toLowerCase().includes(searchText.toLowerCase()) ||
      module.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesTags = selectedTags.length === 0 || 
      (module.tags && module.tags.some(tag => selectedTags.includes(tag)));

    return matchesSearch && matchesTags;
  });

  // Group filtered modules by category
  const filteredCategorized = filteredModules.reduce((acc, module) => {
    const category = module.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {});

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = Object.keys(filteredCategorized).sort();

  return (
    <div className={`ModuleLibrary ${!isExpanded ? 'collapsed' : ''}`}>
      <h2>Module Library</h2>
      
      {/* Search box */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search modules..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', color: '#666' }}>
            Tags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  borderRadius: '3px',
                  border: `1px solid ${selectedTags.includes(tag) ? '#ff6b6b' : '#ddd'}`,
                  backgroundColor: selectedTags.includes(tag) ? '#ff6b6b' : '#f5f5f5',
                  color: selectedTags.includes(tag) ? '#fff' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ModuleList">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category} className="ModuleCategory">
              <div 
                className="CategoryHeader"
                onClick={() => toggleCategory(category)}
              >
                <span className="CategoryToggle">
                  {expandedCategories[category] ? '▼' : '▶'}
                </span>
                <span className="CategoryName">{category}</span>
                <span className="CategoryCount">({filteredCategorized[category].length})</span>
              </div>
              {expandedCategories[category] && (
                <div className="CategoryItems">
                  {filteredCategorized[category].map((module) => (
                    <div 
                      key={module.id} 
                      className={`ModuleItem ${selectedId === `module-${module.id}` ? 'selected' : ''}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'copy';
                        e.dataTransfer.setData('application/json', JSON.stringify(module));
                      }}
                      onClick={() => {
                        if (selectedId === `module-${module.id}`) {
                          onSelectionChange(null);
                        } else {
                          onSelectionChange(`module-${module.id}`);
                        }
                      }}
                    >
                      <h3>{module.name}</h3>
                      <p><small>{module.description}</small></p>
                      <p>📥 {module.input.length} | 📤 {module.output.length}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
            No modules found
          </p>
        )}
      </div>
    </div>
  );
}

function ZoomPercentageDisplay({ show, zoomLevel }) {
  const [opacity, setOpacity] = useState(0);
  const [display, setDisplay] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (show) {
      setDisplay(true);
      setOpacity(1);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    } else {
      setOpacity(0);
      // Wait for fade out animation to complete before hiding
      timerRef.current = setTimeout(() => {
        setDisplay(false);
      }, 500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show]);

  if (!display) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: 1000,
      opacity: opacity,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      {Math.round(zoomLevel * 100)}%
    </div>
  );
}

function SingleModule({ node, onRemove, position, onOutputClick, onInputClick, isDragging, isSelected, onMouseDown, inputValue, onInputValueChange }) {
  return (
    <div 
      className={`SingleModule ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={onMouseDown}
    >
      <div className="node-header">
        <h3>{node.name}</h3>
      </div>
      <div className="node-content">
        <div className="Inputs">
          {node.type === 'textinput' ? (
            <textarea
              value={inputValue || ''}
              onChange={(e) => {
                e.stopPropagation();
                onInputValueChange(node.nodeInstanceId, e.target.value);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="textinput-textarea"
              placeholder="Enter text content..."
              rows="3"
            />
          ) : node.type === 'imageinput' || node.type === 'datainput' ? (
            <div className="file-upload-container">
              <input
                type="file"
                id={`file-input-${node.nodeInstanceId}`}
                onChange={(e) => {
                  e.stopPropagation();
                  if (e.target.files && e.target.files[0]) {
                    onInputValueChange(node.nodeInstanceId, e.target.files[0]);
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="file-input"
                accept={node.type === 'imageinput' ? 'image/*' : '.csv,.json,.xlsx,.xls,.txt'}
              />
              <label htmlFor={`file-input-${node.nodeInstanceId}`} className="file-upload-label">
                {inputValue && inputValue.name ? (
                  <>
                    <span className="file-icon">📄</span>
                    <span className="file-name">{inputValue.name}</span>
                  </>
                ) : (
                  <>
                    <span className="upload-icon">📤</span>
                    <span className="upload-text">
                      {node.type === 'imageinput' ? 'Click to upload image' : 'Click to upload file'}
                    </span>
                  </>
                )}
              </label>
            </div>
          ) : (
            node.input.map((inp, idx) => (
              <div 
                key={idx}
                className="port input-port"
                onClick={(e) => {
                  e.stopPropagation();
                  onInputClick(node.nodeInstanceId, idx);
                }}
                title="Click to connect"
              >
                <span className="port-label">▶ {inp}</span>
              </div>
            ))
          )}
        </div>
        <div className="Outputs">
          {node.output.map((out, idx) => (
            <div 
              key={idx}
              className="port output-port"
              onClick={(e) => {
                e.stopPropagation();
                onOutputClick(node.nodeInstanceId, idx);
              }}
              title="Click to connect"
            >
              <span className="port-label">{out} ▶</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }} className="node-remove">×</button>
    </div>
  );
}

function NodeCanvas({ nodes, onAddNode, onNodeMove, connections, onConnect, selectedId, onSelectionChange, onDeleteConnection, nodeInputValues, onInputValueChange }) {
  const canvasRef = useRef(null);
  const nodeRefs = useRef({}); // Store refs for each node to get their width
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState(null);
  const [temporaryLine, setTemporaryLine] = useState(null);
  const [hoveredConnectionIdx, setHoveredConnectionIdx] = useState(null);
  
  // Canvas pan and zoom states
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [isCanvasPanning, setIsCanvasPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showZoomPercentage, setShowZoomPercentage] = useState(false);
  const zoomTimeoutRef = useRef(null);
  
  // Keep refs to latest state values for use in event handlers
  const canvasPanRef = useRef(canvasPan);
  const canvasZoomRef = useRef(canvasZoom);
  const isCanvasPanningRef = useRef(isCanvasPanning);
  const panStartRef = useRef(panStart);
  
  // Update refs whenever state changes
  useEffect(() => {
    canvasPanRef.current = canvasPan;
    canvasZoomRef.current = canvasZoom;
    isCanvasPanningRef.current = isCanvasPanning;
    panStartRef.current = panStart;
  }, [canvasPan, canvasZoom, isCanvasPanning, panStart]);

  // Helper function to get node width
  const getNodeWidth = (nodeInstanceId) => {
    const ref = nodeRefs.current[nodeInstanceId];
    if (ref) {
      // Try to find the SingleModule element within the wrapper
      const singleModule = ref.querySelector('.SingleModule');
      if (singleModule && singleModule.offsetWidth) {
        return singleModule.offsetWidth;
      }
      // Fallback to wrapper div width
      if (ref.offsetWidth) {
        return ref.offsetWidth;
      }
    }
    return 280; // Default width fallback
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const module = JSON.parse(data);
        const rect = canvas.getBoundingClientRect();
        // Calculate position in canvas coordinate system
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        // Remove pan effect and apply zoom scaling
        const x = screenX / canvasZoomRef.current - canvasPanRef.current.x / canvasZoomRef.current;
        const y = screenY / canvasZoomRef.current - canvasPanRef.current.y / canvasZoomRef.current;
        onAddNode({ ...module, position: { x, y } });
      }
    };

    const handleKeyDown = (e) => {
      // ESC key to cancel connection
      if (e.key === 'Escape' && connectionStart) {
        setConnectionStart(null);
        setTemporaryLine(null);
      }
      // DELETE key to remove selected node
      if (e.key === 'Delete' && selectedId && selectedId.startsWith('node-')) {
        const nodeId = selectedId.replace('node-', '');
        onAddNode(null, nodeId);
        onSelectionChange(null);
      }
    };

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate zoom direction
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(3, canvasZoomRef.current * zoomFactor));
        
        // Adjust pan to zoom towards mouse position
        const zoomDiff = newZoom - canvasZoomRef.current;
        const newPan = {
          x: canvasPanRef.current.x - mouseX * (zoomDiff / canvasZoomRef.current),
          y: canvasPanRef.current.y - mouseY * (zoomDiff / canvasZoomRef.current)
        };
        
        setCanvasZoom(newZoom);
        setCanvasPan(newPan);
        
        // Show zoom percentage
        setShowZoomPercentage(true);
        
        // Clear existing timeout
        if (zoomTimeoutRef.current) {
          clearTimeout(zoomTimeoutRef.current);
        }
        
        // Hide after 1 second of no scrolling
        zoomTimeoutRef.current = setTimeout(() => {
          setShowZoomPercentage(false);
        }, 1000);
      }
    };

    const handleMouseDown = (e) => {
      // Middle mouse button for panning
      if (e.button === 1) {
        e.preventDefault();
        setIsCanvasPanning(true);
        setPanStart({
          x: e.clientX - canvasPanRef.current.x,
          y: e.clientY - canvasPanRef.current.y
        });
      }
    };

    const handleMouseMove = (e) => {
      if (isCanvasPanningRef.current) {
        setCanvasPan({
          x: e.clientX - panStartRef.current.x,
          y: e.clientY - panStartRef.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsCanvasPanning(false);
    };

    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, [onAddNode, selectedId, onSelectionChange, connectionStart]);

  const handleMouseDown = (nodeId, e) => {
    // Prevent interaction with ports
    if (e.target.closest('.port')) return;
    if (e.target.closest('.node-remove')) return;
    
    setIsDragging(true);
    setDraggedNode(nodeId);
    const node = nodes.find(n => n.nodeInstanceId === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Calculate current position in canvas coordinate system
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const canvasX = screenX / canvasZoom - canvasPan.x / canvasZoom;
      const canvasY = screenY / canvasZoom - canvasPan.y / canvasZoom;
      
      setDragOffset({
        x: canvasX - node.position.x,
        y: canvasY - node.position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Calculate current position in canvas coordinate system
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const canvasX = screenX / canvasZoom - canvasPan.x / canvasZoom;
      const canvasY = screenY / canvasZoom - canvasPan.y / canvasZoom;
      
      onNodeMove(draggedNode, {
        x: canvasX - dragOffset.x,
        y: canvasY - dragOffset.y
      });
    }

    // Update connection line to follow node
    if (connectionStart && canvasRef.current) {
      const currentDraggedNode = isDragging ? nodes.find(n => n.nodeInstanceId === draggedNode) : null;
      const sourceNode = currentDraggedNode || nodes.find(n => n.nodeInstanceId === connectionStart.nodeId);
      
      if (sourceNode) {
        const rect = canvasRef.current.getBoundingClientRect();
        const sourceNodeWidth = getNodeWidth(sourceNode.nodeInstanceId);
        // Convert mouse position to canvas coordinates for SVG
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const canvasX = screenX / canvasZoom - canvasPan.x / canvasZoom;
        const canvasY = screenY / canvasZoom - canvasPan.y / canvasZoom;
        
        setTemporaryLine({
          startX: sourceNode.position.x + sourceNodeWidth,
          startY: sourceNode.position.y + 55 + connectionStart.outputIdx * 35,
          endX: canvasX,
          endY: canvasY
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleOutputClick = (nodeId, outputIdx) => {
    const node = nodes.find(n => n.nodeInstanceId === nodeId);
    if (node) {
      const nodeWidth = getNodeWidth(nodeId);
      setConnectionStart({ 
        nodeId, 
        outputIdx, 
        x: node.position.x + nodeWidth,
        y: node.position.y + 55 + outputIdx * 35
      });
    }
  };

  const handleInputClick = (nodeId, inputIdx) => {
    if (connectionStart) {
      onConnect(connectionStart.nodeId, connectionStart.outputIdx, nodeId, inputIdx);
      setConnectionStart(null);
      setTemporaryLine(null);
    }
  };

  return (
    <div 
      className='NodeCanvas'
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        // Deselect if clicking on canvas, SVG background, or empty area
        if (e.target === canvasRef.current || 
            e.target.tagName === 'svg' ||
            (e.target.tagName === 'rect' && e.target.classList.length === 0)) {
          onSelectionChange(null);
        }
      }}
      style={{
        cursor: isCanvasPanning ? 'grabbing' : 'default',
        overflow: 'hidden'
      }}
    >
      <ZoomPercentageDisplay show={showZoomPercentage} zoomLevel={canvasZoom} />

      {/* Zoom controls for touch devices */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        gap: '8px',
        zIndex: 100,
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => setCanvasZoom(prev => Math.min(prev * 1.2, 3))}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            backgroundColor: '#ffa500',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setCanvasZoom(prev => Math.max(prev / 1.2, 0.2))}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            backgroundColor: '#ffa500',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          title="Zoom out"
        >
          −
        </button>
      </div>

      {/* Canvas content wrapper for pan and zoom */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasZoom})`,
        transformOrigin: '0 0',
        transition: isCanvasPanning ? 'none' : 'none'
      }}>
        {/* Draw connection lines */}
        <svg className="connections" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', overflow: 'visible', width: '100%', height: '100%' }}>
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.nodeInstanceId === conn.from.nodeId);
            const toNode = nodes.find(n => n.nodeInstanceId === conn.to.nodeId);
            if (!fromNode || !toNode) return null;

            const fromNodeWidth = getNodeWidth(conn.from.nodeId);
            const fromX = fromNode.position.x + fromNodeWidth;
            const fromY = fromNode.position.y + 55 + conn.from.outputIdx * 35;
            const toX = toNode.position.x;
            const toY = toNode.position.y + 55 + conn.to.inputIdx * 35;

            return (
              <g key={idx}>
                {/* Invisible thick line for hover detection */}
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="transparent"
                  strokeWidth="12"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredConnectionIdx(idx)}
                  onMouseLeave={() => setHoveredConnectionIdx(null)}
                />
                {/* Visible connection line */}
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#ffa500"
                  strokeWidth="2"
                  pointerEvents="none"
                />
                {/* Delete button when hovering */}
                {hoveredConnectionIdx === idx && (
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConnection(idx);
                    }}
                    onMouseEnter={() => setHoveredConnectionIdx(idx)}
                    onMouseLeave={() => setHoveredConnectionIdx(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Calculate middle point for button position */}
                    <circle
                      cx={(fromX + toX) / 2}
                      cy={(fromY + toY) / 2}
                      r="12"
                      fill="#ff6b6b"
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={(fromX + toX) / 2}
                      y={(fromY + toY) / 2}
                      textAnchor="middle"
                      dy="0.3em"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                      style={{ cursor: 'pointer', pointerEvents: 'none' }}
                    >
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Temporary connection line while dragging */}
          {temporaryLine && (
            <line
              x1={temporaryLine.startX}
              y1={temporaryLine.startY}
              x2={temporaryLine.endX}
              y2={temporaryLine.endY}
              stroke="#ffa500"
              strokeWidth="2"
              strokeDasharray="5,5"
              pointerEvents="none"
            />
          )}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.nodeInstanceId}
            ref={(el) => {
              if (el) {
                nodeRefs.current[node.nodeInstanceId] = el;
              }
            }}
            style={{ pointerEvents: 'auto' }}
          >
            <SingleModule 
              node={node}
              position={node.position}
              onRemove={() => onAddNode(null, node.nodeInstanceId)}
              onOutputClick={handleOutputClick}
              onInputClick={handleInputClick}
              isSelected={selectedId === `node-${node.nodeInstanceId}`}
              isDragging={draggedNode === node.nodeInstanceId}
              inputValue={nodeInputValues[node.nodeInstanceId] || ''}
              onInputValueChange={onInputValueChange}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(node.nodeInstanceId, e);
                onSelectionChange(`node-${node.nodeInstanceId}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [libraryExpanded, setLibraryExpanded] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(true);
  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [nodeCounter, setNodeCounter] = useState(0);
  const [connections, setConnections] = useState([]);
  const [nodeInputValues, setNodeInputValues] = useState({});

  useEffect(() => {
    // Load all JSON files from modulenodes folder
    const loadModules = async () => {
      try {
        const moduleFiles = ['basic', 'marketing', 'routine','technology','finance','hr','memes'];
        let allModules = [];

        for (const file of moduleFiles) {
          try {
            const module = await import(`./modulenodes/${file}.json`);
            const data = module.default || module;
            if (data.moduleNodes && Array.isArray(data.moduleNodes)) {
              // Add category based on filename if not already present
              const categorizedModules = data.moduleNodes.map(m => ({
                ...m,
                category: m.category || (file.charAt(0).toUpperCase() + file.slice(1))
              }));
              allModules = [...allModules, ...categorizedModules];
            }
          } catch (error) {
            console.warn(`Failed to load ${file}.json:`, error);
          }
        }

        setModules(allModules);
      } catch (error) {
        console.error('Error loading modules:', error);
      }
    };

    loadModules();
  }, []);

  const handleAddNode = (module, removeId = null) => {
    if (removeId) {
      // Remove node
      setNodes(nodes.filter(n => n.nodeInstanceId !== removeId));
      // Also remove connections related to this node
      setConnections(connections.filter(
        conn => conn.from.nodeId !== removeId && conn.to.nodeId !== removeId
      ));
    } else if (module) {
      // Add node with unique instance id
      const newNode = {
        ...module,
        nodeInstanceId: `${module.id}-${nodeCounter}`,
        position: module.position || { x: 100, y: 100 }
      };
      setNodes([...nodes, newNode]);
      setNodeCounter(nodeCounter + 1);
    }
  };

  const handleNodeMove = (nodeInstanceId, position) => {
    setNodes(nodes.map(n => 
      n.nodeInstanceId === nodeInstanceId 
        ? { ...n, position }
        : n
    ));
  };

  const handleConnect = (fromNodeId, outputIdx, toNodeId, inputIdx) => {
    const newConnection = {
      from: { nodeId: fromNodeId, outputIdx },
      to: { nodeId: toNodeId, inputIdx }
    };
    setConnections([...connections, newConnection]);
  };

  const handleDeleteConnection = (connectionIdx) => {
    setConnections(connections.filter((_, idx) => idx !== connectionIdx));
  };

  const handleInputValueChange = (nodeInstanceId, value) => {
    setNodeInputValues({
      ...nodeInputValues,
      [nodeInstanceId]: value
    });
  };

  // Get selected node/module for preview
  const getSelectedForPreview = () => {
    if (!selectedId) {
      // If nothing selected, check if there's an Output node and show its combined output
      const outputNode = nodes.find(n => n.type === 'output');
      if (outputNode) {
        return getOutputNodeContent(outputNode.nodeInstanceId);
      }
      return null;
    }
    
    if (selectedId.startsWith('node-')) {
      const nodeInstanceId = selectedId.replace('node-', '');
      const node = nodes.find(n => n.nodeInstanceId === nodeInstanceId);
      if (node) {
        // If it's an Output node, show combined content
        if (node.type === 'output') {
          return getOutputNodeContent(nodeInstanceId);
        }
        // For textinput nodes, use the textarea value as the prompt
        if (node.type === 'textinput') {
          const textVal = nodeInputValues[nodeInstanceId];
          return {
            name: node.name,
            description: node.description,
            defaultPrompt: textVal || node.defaultPrompt
          };
        }
        // For other nodes, check which output ports are connected
        const connectedOutputs = connections
          .filter(conn => conn.from.nodeId === nodeInstanceId)
          .map(conn => conn.from.outputIdx)
          .sort((a, b) => a - b); // Sort to maintain order
        
        // Determine the output port override string (e.g., "S" or "SW" or "SWOT")
        let outputPortOverride = null;
        if (connectedOutputs.length > 0 && node.placeholders && node.placeholders.length > 0) {
          let placeholderStr = '';
          connectedOutputs.forEach(outputIdx => {
            if (outputIdx < node.placeholders.length) {
              placeholderStr += node.placeholders[outputIdx];
            }
          });
          if (placeholderStr) {
            outputPortOverride = placeholderStr;
          }
        }
        
        // Get full content including upstream nodes and apply placeholder extraction
        const fullContent = getNodeFullContent(nodeInstanceId, new Set(), outputPortOverride);
        
        return {
          name: node.name,
          description: node.description,
          defaultPrompt: fullContent
        };
      }
    } else if (selectedId.startsWith('module-')) {
      const moduleId = selectedId.replace('module-', '');
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        return {
          name: module.name,
          description: module.description,
          defaultPrompt: module.defaultPrompt
        };
      }
    }
    return null;
  };

  // Extract content based on placeholder selectors
  // selector can be a string like "S" or "SWO" or "En" or "Pr" or "Pri"
  // placeholdersList is the array of valid placeholders for this node (e.g., ["P", "E", "S", "T", "L", "En"])
  const extractPlaceholderContent = (prompt, selector, placeholdersList = null) => {
    if (!selector || !prompt) return prompt;
    
    // If we have a list of placeholders, parse selector based on that list
    let placeholdersToExtract = [];
    
    if (placeholdersList && placeholdersList.length > 0) {
      // Build a list of placeholders to extract by finding matches in selector
      let remainingSelector = selector;
      placeholdersList.forEach(placeholder => {
        if (remainingSelector.startsWith(placeholder)) {
          placeholdersToExtract.push(placeholder);
          remainingSelector = remainingSelector.substring(placeholder.length);
        }
      });
      
      // If we couldn't parse with the list, fallback to character-by-character
      if (placeholdersToExtract.length === 0) {
        placeholdersToExtract = selector.split('');
      }
    } else {
      // Fallback: treat selector as individual characters
      placeholdersToExtract = selector.split('');
    }
    
    let result = '';
    placeholdersToExtract.forEach(placeholder => {
      // Escape special regex characters in placeholder
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\[${escapedPlaceholder}\\]([^\\[]*?)(?=\\[|$)`, 'gs');
      const match = pattern.exec(prompt);
      if (match) {
        result += (result ? '\n\n' : '') + match[1].trim();
      }
    });
    
    return result || prompt;
  };

  // Get full content of a node including all upstream nodes
  // outputPortOverride: if provided, only return this specific placeholder's content
  const getNodeFullContent = (nodeInstanceId, visited = new Set(), outputPortOverride = null) => {
    // Prevent infinite loops
    if (visited.has(nodeInstanceId)) return '';
    visited.add(nodeInstanceId);

    // Find connections that lead to this node (upstream inputs)
    const inputConnections = connections.filter(conn => conn.to.nodeId === nodeInstanceId);
    
    const currentNode = nodes.find(n => n.nodeInstanceId === nodeInstanceId);
    if (!currentNode) return '';
    
    // If no upstream connections, return only this node's own content
    if (inputConnections.length === 0) {
      let ownPart = currentNode.defaultPrompt;
      if (currentNode.type === 'textinput') {
        const txt = nodeInputValues[nodeInstanceId];
        if (txt) ownPart = txt;
      } else if (outputPortOverride && currentNode.defaultPrompt.includes('[')) {
        // If an output port is specified, extract only that placeholder's content
        ownPart = extractPlaceholderContent(currentNode.defaultPrompt, outputPortOverride, currentNode.placeholders);
      }
      return ownPart;
    }
    
    // If there are upstream connections, concatenate: upstream content + this node's content
    let fullContent = '';
    
    // Group input connections by source node to handle multiple outputs from same node
    const connectionsBySource = {};
    inputConnections.forEach(conn => {
      if (!connectionsBySource[conn.from.nodeId]) {
        connectionsBySource[conn.from.nodeId] = [];
      }
      connectionsBySource[conn.from.nodeId].push(conn.from.outputIdx);
    });
    
    // Get content from each upstream node once, combining all its outputs
    Object.entries(connectionsBySource).forEach(([sourceNodeId, outputIndices]) => {
      const sourceNode = nodes.find(n => n.nodeInstanceId === sourceNodeId);
      if (sourceNode) {
        // Determine what to get from upstream node based on all its connected output ports
        let upstreamOverride = null;
        if (sourceNode.placeholders && sourceNode.placeholders.length > 0) {
          let placeholderStr = '';
          // Sort indices to maintain order
          outputIndices.sort((a, b) => a - b).forEach(outputIdx => {
            if (outputIdx < sourceNode.placeholders.length) {
              placeholderStr += sourceNode.placeholders[outputIdx];
            }
          });
          if (placeholderStr) {
            upstreamOverride = placeholderStr;
          }
        }
        
        // Recursively get the full content of the upstream node (once per source node)
        const upstreamContent = getNodeFullContent(sourceNodeId, new Set(visited), upstreamOverride);
        if (upstreamContent) {
          fullContent += upstreamContent + '\n\n';
        }
      }
    });
    
    // Add this node's own content
    let ownPart = currentNode.defaultPrompt;
    if (currentNode.type === 'textinput') {
      const txt = nodeInputValues[nodeInstanceId];
      if (txt) ownPart = txt;
    } else if (outputPortOverride && currentNode.defaultPrompt.includes('[')) {
      // If an output port override is specified, extract only that placeholder's content
      ownPart = extractPlaceholderContent(currentNode.defaultPrompt, outputPortOverride, currentNode.placeholders);
    }
    fullContent += ownPart;
    
    return fullContent.trim();
  };

  // Get combined output content from Output node
  const getOutputNodeContent = (outputNodeInstanceId) => {
    const fullContent = getNodeFullContent(outputNodeInstanceId);
    
    return {
      name: 'Final Output',
      defaultPrompt: fullContent || 'No content connected yet'
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <Toolbar 
          onLibraryToggle={() => setLibraryExpanded(!libraryExpanded)}
          onPreviewToggle={() => setPreviewExpanded(!previewExpanded)}
        />
      </header>
      <div className="App-body">
        <ModuleLibrary 
          isExpanded={libraryExpanded}
          modules={modules}
          selectedId={selectedId}
          onSelectionChange={setSelectedId}
        />
        <NodeCanvas 
          nodes={nodes}
          onAddNode={handleAddNode}
          onNodeMove={handleNodeMove}
          connections={connections}
          onConnect={handleConnect}
          selectedId={selectedId}
          onSelectionChange={setSelectedId}
          onDeleteConnection={handleDeleteConnection}
          nodeInputValues={nodeInputValues}
          onInputValueChange={handleInputValueChange}
        />
        <PromptPreview 
          isExpanded={previewExpanded}
          selectedNode={getSelectedForPreview()}
        />
      </div>
    </div>
  );
}

export default App;

import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from 'react';
import { getSpecies, toLocaleText } from './game';
import { Locale, TreeDisplayNode } from './types';

type TreeViewProps = {
  trees: TreeDisplayNode[];
  locale: Locale;
  selectedNodeIds: string[];
  interactive: boolean;
  onNodeSelect: (nodeId: string) => void;
  onNodeDrop: (targetNodeId: string, draggedNodeId: string) => void;
  onNodeDragStart: (nodeId: string) => void;
};

type Line = { x1: number; y1: number; x2: number; y2: number };
type TouchDragState = {
  draggedId: string;
  tree: TreeDisplayNode;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  targetId: string | null;
};

type TouchGestureState = {
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  dragging: boolean;
};

type PositionedNode = {
  id: string;
  kind: 'species' | 'internal';
  speciesId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
};

type TreeLayout = {
  nodes: PositionedNode[];
  lines: Line[];
  width: number;
  height: number;
};

type LayoutResult = {
  nodes: PositionedNode[];
  lines: Line[];
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
  nextLeafIndex: number;
};

const LEAF_WIDTH = 110;
const LEAF_HEIGHT = 110;
const INTERNAL_SIZE = 18;
const HORIZONTAL_GAP = 28;
const VERTICAL_GAP = 10;
const CARD_PADDING = 10;

const getBounds = (nodes: PositionedNode[]) => ({
  width: Math.max(...nodes.map((node) => node.x + node.width)),
  height: Math.max(...nodes.map((node) => node.y + node.height)),
});

const getRootCardIdAtPoint = (clientX: number, clientY: number, draggedId: string): string | null => {
  const target = document.elementFromPoint(clientX, clientY);
  if (!(target instanceof Element)) return null;
  const rootCard = target.closest<HTMLElement>('[data-tree-root-id]');
  const targetId = rootCard?.dataset.treeRootId ?? null;
  return targetId && targetId !== draggedId ? targetId : null;
};

const layoutTreeNode = (node: TreeDisplayNode, leafIndex: number): LayoutResult => {
  if (node.kind === 'species') {
    const y = leafIndex * (LEAF_HEIGHT + VERTICAL_GAP);
    const nodes: PositionedNode[] = [
      {
        id: node.id,
        kind: 'species',
        speciesId: node.speciesId,
        x: 0,
        y,
        width: LEAF_WIDTH,
        height: LEAF_HEIGHT,
        anchorX: LEAF_WIDTH,
        anchorY: y + LEAF_HEIGHT / 2,
      },
    ];
    const bounds = getBounds(nodes);
    return {
      nodes,
      lines: [],
      width: bounds.width,
      height: bounds.height,
      anchorX: LEAF_WIDTH,
      anchorY: y + LEAF_HEIGHT / 2,
      nextLeafIndex: leafIndex + 1,
    };
  }

  let nextLeafIndex = leafIndex;
  const childLayouts = node.children.map((child) => {
    const layout = layoutTreeNode(child, nextLeafIndex);
    nextLeafIndex = layout.nextLeafIndex;
    return layout;
  });

  const jointCenterX = Math.max(...childLayouts.map((child) => child.anchorX)) + HORIZONTAL_GAP;
  const minChildY = Math.min(...childLayouts.map((child) => child.anchorY));
  const maxChildY = Math.max(...childLayouts.map((child) => child.anchorY));
  const jointCenterY = (minChildY + maxChildY) / 2;

  const nodes = childLayouts.flatMap((child) => child.nodes);
  const lines = childLayouts.flatMap((child) => child.lines);

  for (const child of childLayouts) {
    lines.push({
      x1: child.anchorX,
      y1: child.anchorY,
      x2: jointCenterX,
      y2: child.anchorY,
    });
  }

  if (childLayouts.length > 1) {
    lines.push({
      x1: jointCenterX,
      y1: minChildY,
      x2: jointCenterX,
      y2: maxChildY,
    });
  }

  nodes.push({
    id: node.id,
    kind: 'internal',
    x: jointCenterX - INTERNAL_SIZE / 2,
    y: jointCenterY - INTERNAL_SIZE / 2,
    width: INTERNAL_SIZE,
    height: INTERNAL_SIZE,
    anchorX: jointCenterX,
    anchorY: jointCenterY,
  });

  const bounds = getBounds(nodes);

  return {
    nodes,
    lines,
    width: bounds.width,
    height: bounds.height,
    anchorX: jointCenterX,
    anchorY: jointCenterY,
    nextLeafIndex,
  };
};

const layoutTree = (tree: TreeDisplayNode): TreeLayout => {
  const result = layoutTreeNode(tree, 0);
  return {
    nodes: result.nodes,
    lines: result.lines,
    width: result.width,
    height: result.height,
  };
};

function TreeLayoutView({
  tree,
  locale,
}: {
  tree: TreeDisplayNode;
  locale: Locale;
}) {
  const layout = useMemo(() => layoutTree(tree), [tree]);

  return (
    <div
      className="tree-card-body"
      style={{
        width: layout.width + CARD_PADDING * 2,
        height: layout.height + CARD_PADDING * 2,
      }}
    >
      <svg
        className="tree-lines"
        width={layout.width + CARD_PADDING * 2}
        height={layout.height + CARD_PADDING * 2}
        aria-hidden="true"
      >
        {layout.lines.map((line, index) => (
          <line
            key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}-${index}`}
            x1={line.x1 + CARD_PADDING}
            y1={line.y1 + CARD_PADDING}
            x2={line.x2 + CARD_PADDING}
            y2={line.y2 + CARD_PADDING}
            className="tree-line"
          />
        ))}
      </svg>

      {layout.nodes.map((node) => {
        if (node.kind === 'species') {
          const species = node.speciesId ? getSpecies(node.speciesId) : null;
          const primary = species ? toLocaleText(species.names, locale) : node.speciesId ?? node.id;
          const secondary = species ? toLocaleText(species.names, locale === 'en' ? 'zhHans' : 'en') : '';

          return (
            <div
              key={node.id}
              className="tree-node tree-node-species"
              style={{
                left: node.x + CARD_PADDING,
                top: node.y + CARD_PADDING,
                width: node.width,
              }}
            >
              <div className="tree-species">
                {species ? (
                  <img
                    src={species.photoUrl}
                    alt={primary}
                    className="tree-species-photo"
                    loading="lazy"
                    draggable={false}
                  />
                ) : null}
                <span className="tree-species-primary">{primary}</span>
                {secondary ? <span className="tree-species-secondary">{secondary}</span> : null}
              </div>
            </div>
          );
        }

        return (
          <div
            key={node.id}
            className="tree-node tree-node-internal"
            style={{
              left: node.x + CARD_PADDING,
              top: node.y + CARD_PADDING,
              width: node.width,
              height: node.height,
            }}
            aria-hidden="true"
          >
            <span className="tree-joint-dot" />
          </div>
        );
      })}
    </div>
  );
}

function TreeCard({
  tree,
  locale,
  interactive,
  selected,
  dropTarget,
  touchDragging,
  onNodeSelect,
  onNodeDrop,
  onNodeDragStart,
  onTouchDragStart,
  onTouchDragMove,
  onTouchDragEnd,
}: {
  tree: TreeDisplayNode;
  locale: Locale;
  interactive: boolean;
  selected: boolean;
  dropTarget: boolean;
  touchDragging: boolean;
  onNodeSelect: (nodeId: string) => void;
  onNodeDrop: (targetNodeId: string, draggedNodeId: string) => void;
  onNodeDragStart: (nodeId: string) => void;
  onTouchDragStart: (state: TouchDragState) => void;
  onTouchDragMove: (draggedId: string, x: number, y: number, targetId: string | null) => void;
  onTouchDragEnd: (draggedId: string, targetId: string | null) => void;
}) {
  const touchGestureRef = useRef<TouchGestureState | null>(null);
  const suppressClickRef = useRef(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNodeSelect(tree.id);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType === 'mouse') return;
    const rootCardRect = event.currentTarget.getBoundingClientRect();
    touchGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rootCardRect.left,
      offsetY: event.clientY - rootCardRect.top,
      dragging: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = touchGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const movedX = event.clientX - gesture.startX;
    const movedY = event.clientY - gesture.startY;
    const movedEnough = Math.hypot(movedX, movedY) > 8;

    if (!gesture.dragging && movedEnough) {
      gesture.dragging = true;
      suppressClickRef.current = true;
      onNodeDragStart(tree.id);
      onTouchDragStart({
        draggedId: tree.id,
        tree,
        x: event.clientX,
        y: event.clientY,
        offsetX: gesture.offsetX,
        offsetY: gesture.offsetY,
        targetId: null,
      });
    }

    if (!gesture.dragging) return;

    event.preventDefault();
    onTouchDragMove(tree.id, event.clientX, event.clientY, getRootCardIdAtPoint(event.clientX, event.clientY, tree.id));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = touchGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (gesture.dragging) {
      event.preventDefault();
      onTouchDragEnd(tree.id, getRootCardIdAtPoint(event.clientX, event.clientY, tree.id));
    }

    touchGestureRef.current = null;
  };

  return (
    <section className="tree-card">
      <div
        data-tree-root-id={tree.id}
        className={`tree-root-card ${interactive ? 'interactive' : ''} ${selected ? 'selected' : ''} ${dropTarget ? 'drop-target' : ''} ${touchDragging ? 'touch-dragging' : ''}`}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        draggable={interactive}
        onClick={() => {
          if (!interactive) return;
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          onNodeSelect(tree.id);
        }}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onContextMenu={(event) => {
          if (interactive) event.preventDefault();
        }}
        onDragStart={(event) => {
          if (!interactive) return;
          const rootCardRect = event.currentTarget.getBoundingClientRect();
          event.dataTransfer.setData('text/plain', tree.id);
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setDragImage(
            event.currentTarget,
            event.clientX - rootCardRect.left,
            event.clientY - rootCardRect.top,
          );
          onNodeDragStart(tree.id);
        }}
        onDragOver={(event) => {
          if (interactive) event.preventDefault();
        }}
        onDrop={(event) => {
          if (!interactive) return;
          event.preventDefault();
          const draggedNodeId = event.dataTransfer.getData('text/plain');
          if (draggedNodeId) onNodeDrop(tree.id, draggedNodeId);
        }}
      >
        <TreeLayoutView tree={tree} locale={locale} />
      </div>
    </section>
  );
}

export function TreeView({
  trees,
  selectedNodeIds,
  interactive,
  locale,
  onNodeSelect,
  onNodeDrop,
  onNodeDragStart,
}: TreeViewProps) {
  const [touchDrag, setTouchDrag] = useState<TouchDragState | null>(null);

  return (
    <section className="tree-workspace">
      <div className="tree-forest">
        {trees.map((tree) => (
          <TreeCard
            key={tree.id}
            tree={tree}
            locale={locale}
            interactive={interactive}
            selected={selectedNodeIds.includes(tree.id)}
            dropTarget={touchDrag?.targetId === tree.id}
            touchDragging={touchDrag?.draggedId === tree.id}
            onNodeSelect={onNodeSelect}
            onNodeDrop={onNodeDrop}
            onNodeDragStart={onNodeDragStart}
            onTouchDragStart={(state) => setTouchDrag(state)}
            onTouchDragMove={(draggedId, x, y, targetId) =>
              setTouchDrag((current) =>
                current && current.draggedId === draggedId ? { ...current, x, y, targetId } : current,
              )
            }
            onTouchDragEnd={(draggedId, targetId) => {
              setTouchDrag((current) => (current?.draggedId === draggedId ? null : current));
              if (targetId) onNodeDrop(targetId, draggedId);
            }}
          />
        ))}
      </div>
      {touchDrag ? (
        <div
          className="touch-drag-preview"
          style={{
            left: touchDrag.x - touchDrag.offsetX,
            top: touchDrag.y - touchDrag.offsetY,
          }}
        >
          <div className="tree-root-card touch-preview-card">
            <TreeLayoutView tree={touchDrag.tree} locale={locale} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

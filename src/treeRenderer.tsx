import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getSpecies, toLocaleText } from './game';
import { LayoutNode, Locale } from './types';

type TreeRendererProps = {
  root: LayoutNode;
  placements: Record<string, string | null>;
  correctPlacements: Record<string, string>;
  locale: Locale;
  selectedSpeciesId: string | null;
  review: boolean;
  onSlotClick: (slotId: string) => void;
  onSlotDrop: (slotId: string, speciesId: string) => void;
};

type Line = { x1: number; y1: number; x2: number; y2: number };

function TreeNodeView({
  node,
  placements,
  correctPlacements,
  locale,
  selectedSpeciesId,
  review,
  onSlotClick,
  onSlotDrop,
  registerAnchor,
}: TreeRendererProps & {
  node: LayoutNode;
  registerAnchor: (id: string, element: HTMLDivElement | HTMLButtonElement | null) => void;
}) {
  if (node.kind === 'slot') {
    const slotId = node.slotId ?? node.id;
    const currentSpecies = placements[slotId];
    const solutionSpecies = correctPlacements[slotId];
    const species = review ? getSpecies(solutionSpecies) : currentSpecies ? getSpecies(currentSpecies) : null;
    const displayedName = species ? toLocaleText(species.names, locale) : '';
    const isCorrect = !review || currentSpecies === solutionSpecies;

    return (
      <button
        ref={(element) => registerAnchor(node.id, element)}
        type="button"
        className={`tree-slot ${currentSpecies ? 'tree-slot-filled' : 'tree-slot-empty'} ${review ? (isCorrect ? 'tree-slot-correct' : 'tree-slot-wrong') : ''}`}
        onClick={() => onSlotClick(slotId)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const speciesId = event.dataTransfer.getData('text/plain');
          if (speciesId) {
            onSlotDrop(slotId, speciesId);
            return;
          }
          if (selectedSpeciesId) onSlotDrop(slotId, selectedSpeciesId);
        }}
      >
        <span className="tree-slot-label">{review ? displayedName : displayedName || (locale === 'zhHans' ? '拖放到这里' : 'Drop here')}</span>
      </button>
    );
  }

  return (
    <div className="tree-branch">
      <div ref={(element) => registerAnchor(node.id, element)} className="tree-joint" aria-hidden="true">
        <span className="tree-joint-dot" />
      </div>
      <div className="tree-branch-children">
        {node.children?.map((child) => (
          <TreeNodeView
            key={child.id}
            node={child}
            placements={placements}
            correctPlacements={correctPlacements}
            locale={locale}
            selectedSpeciesId={selectedSpeciesId}
            review={review}
            onSlotClick={onSlotClick}
            onSlotDrop={onSlotDrop}
            registerAnchor={registerAnchor}
          />
        ))}
      </div>
    </div>
  );
}

function TreeCard(props: TreeRendererProps & { label?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef(new Map<string, HTMLDivElement | HTMLButtonElement | null>());
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const update = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setBounds({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [props.root, props.review, props.selectedSpeciesId, props.placements]);

  const registerAnchor = (id: string, element: HTMLDivElement | HTMLButtonElement | null) => {
    anchorRefs.current.set(id, element);
  };

  const lines = useMemo<Line[]>(() => {
    const rootRect = containerRef.current?.getBoundingClientRect();
    if (!rootRect) return [];

    const result: Line[] = [];
    const walk = (node: LayoutNode) => {
      if (node.kind !== 'branch') return;
      const parentRect = anchorRefs.current.get(node.id)?.getBoundingClientRect();
      if (!parentRect) return;

      for (const child of node.children ?? []) {
        const childRect = anchorRefs.current.get(child.id)?.getBoundingClientRect();
        if (!childRect) continue;
        result.push({
          x1: parentRect.left + parentRect.width / 2 - rootRect.left,
          y1: parentRect.bottom - rootRect.top,
          x2: childRect.left + childRect.width / 2 - rootRect.left,
          y2: childRect.top - rootRect.top,
        });
        walk(child);
      }
    };

    walk(props.root);
    return result;
  }, [bounds.width, bounds.height, props.root, props.placements, props.review, props.selectedSpeciesId]);

  return (
    <section className="tree-card">
      {props.label ? <div className="tree-card-label">{props.label}</div> : null}
      <div ref={containerRef} className="tree-card-body">
        <svg className="tree-lines" width={bounds.width} height={bounds.height} aria-hidden="true">
          {lines.map((line, index) => (
            <line
              key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="tree-line"
            />
          ))}
        </svg>
        <TreeNodeView {...props} node={props.root} registerAnchor={registerAnchor} />
      </div>
    </section>
  );
}

export function TreeView(props: TreeRendererProps) {
  return <TreeCard {...props} />;
}

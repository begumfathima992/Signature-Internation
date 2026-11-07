import { useCallback, useEffect, useState } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import ServiceFormModal from './ServiceFormModal.jsx';
import { useToast } from './toast.js';
import { useAdminRequest } from './useAdminRequest.js';

const CATEGORIES = '/api/admin/categories';

// Screen reader messages for drag and drop that use names rather than ids.
function announcements(titleOf) {
  return {
    onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}. Use the arrow keys to move it, Space to drop.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${titleOf(active.id)} moved to the position of ${titleOf(over.id)}.`
        : `${titleOf(active.id)} is not over a list position.`,
    onDragEnd: ({ active, over }) =>
      over ? `${titleOf(active.id)} dropped at the position of ${titleOf(over.id)}.` : `${titleOf(active.id)} dropped.`,
    onDragCancel: ({ active }) => `Moving ${titleOf(active.id)} was cancelled.`,
  };
}

function useDragSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
}

export default function ServicesManager() {
  const request = useAdminRequest();
  const toast = useToast();
  const sensors = useDragSensors();
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [expanded, setExpanded] = useState(() => new Set());
  const [form, setForm] = useState(null); // { kind, initial, category }
  const [pendingDelete, setPendingDelete] = useState(null); // { kind, entity, category }

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await request(CATEGORIES);
      setCategories(data.categories);
      setStatus('ready');
    } catch (error) {
      if (error.status !== 401) setStatus('error');
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const replaceCategory = (id, change) =>
    setCategories((current) => current.map((category) => (category.id === id ? change(category) : category)));

  function toggleExpanded(id) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveForm(values) {
    const { kind, initial, category } = form;
    if (kind === 'category') {
      if (initial) {
        const { category: saved } = await request(`${CATEGORIES}/${initial.id}`, { method: 'PUT', body: values });
        replaceCategory(initial.id, (current) => ({ ...current, ...saved, items: current.items }));
        toast.success(`Saved “${saved.title}”.`);
      } else {
        const { category: saved } = await request(CATEGORIES, { method: 'POST', body: values });
        setCategories((current) => [...current, saved]);
        toast.success(`Added “${saved.title}”.`);
      }
    } else {
      const base = `${CATEGORIES}/${category.id}/items`;
      if (initial) {
        const { item } = await request(`${base}/${initial.id}`, { method: 'PUT', body: values });
        replaceCategory(category.id, (current) => ({
          ...current,
          items: current.items.map((existing) => (existing.id === item.id ? item : existing)),
        }));
        toast.success(`Saved “${item.title}”.`);
      } else {
        const { item } = await request(base, { method: 'POST', body: values });
        replaceCategory(category.id, (current) => ({ ...current, items: [...current.items, item] }));
        setExpanded((current) => new Set(current).add(category.id));
        toast.success(`Added “${item.title}” to ${category.title}.`);
      }
    }
    setForm(null);
  }

  async function toggleCategoryVisibility(category) {
    const { title, slug, description, icon } = category;
    try {
      const { category: saved } = await request(`${CATEGORIES}/${category.id}`, {
        method: 'PUT',
        body: { title, slug, description, icon, isVisible: !category.isVisible },
      });
      replaceCategory(category.id, (current) => ({ ...current, ...saved, items: current.items }));
      toast.success(saved.isVisible ? `“${title}” is shown on the website.` : `“${title}” is hidden from the website.`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function toggleItemVisibility(category, item) {
    try {
      const { item: saved } = await request(`${CATEGORIES}/${category.id}/items/${item.id}`, {
        method: 'PUT',
        body: { title: item.title, slug: item.slug, isVisible: !item.isVisible },
      });
      replaceCategory(category.id, (current) => ({
        ...current,
        items: current.items.map((existing) => (existing.id === saved.id ? saved : existing)),
      }));
      toast.success(
        saved.isVisible ? `“${item.title}” is shown on the website.` : `“${item.title}” is hidden from the website.`,
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function confirmDelete() {
    const { kind, entity, category } = pendingDelete;
    try {
      if (kind === 'category') {
        await request(`${CATEGORIES}/${entity.id}`, { method: 'DELETE' });
        setCategories((current) => current.filter((existing) => existing.id !== entity.id));
      } else {
        await request(`${CATEGORIES}/${category.id}/items/${entity.id}`, { method: 'DELETE' });
        replaceCategory(category.id, (current) => ({
          ...current,
          items: current.items.filter((existing) => existing.id !== entity.id),
        }));
      }
      toast.success(`Deleted “${entity.title}”.`);
      setPendingDelete(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function saveOrder(url, ids, revert) {
    try {
      await request(url, { method: 'PATCH', body: { ids } });
      toast.success('New order saved.');
    } catch (error) {
      revert();
      toast.error(error.message);
    }
  }

  function handleCategoryDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const previous = categories;
    const next = arrayMove(
      previous,
      previous.findIndex((category) => category.id === active.id),
      previous.findIndex((category) => category.id === over.id),
    );
    setCategories(next);
    saveOrder(
      `${CATEGORIES}/reorder`,
      next.map((category) => category.id),
      () => setCategories(previous),
    );
  }

  function handleItemDragEnd(category, { active, over }) {
    if (!over || active.id === over.id) return;
    const previous = category.items;
    const next = arrayMove(
      previous,
      previous.findIndex((item) => item.id === active.id),
      previous.findIndex((item) => item.id === over.id),
    );
    replaceCategory(category.id, (current) => ({ ...current, items: next }));
    saveOrder(
      `${CATEGORIES}/${category.id}/items/reorder`,
      next.map((item) => item.id),
      () => replaceCategory(category.id, (current) => ({ ...current, items: previous })),
    );
  }

  const categoryTitle = (id) => categories.find((category) => category.id === id)?.title ?? 'item';

  return (
    <>
      <PageMeta title="Services | Admin" noIndex />
      <div className="admin-page-header">
        <div>
          <h1>Services</h1>
          <p>
            Drag <Icon name="grip" size={14} /> to change the order. Changes appear on the website within a minute.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary button--sm"
          onClick={() => setForm({ kind: 'category', initial: null })}
        >
          <Icon name="plus" size={18} /> Add category
        </button>
      </div>

      {status === 'loading' && (
        <div className="admin-card admin-empty" role="status">
          <span className="spinner" aria-hidden="true" /> Loading services…
        </div>
      )}
      {status === 'error' && (
        <div className="admin-card admin-empty" role="alert">
          <p>The services could not be loaded.</p>
          <button type="button" className="button button--secondary button--sm" onClick={load}>
            Try again
          </button>
        </div>
      )}
      {status === 'ready' && categories.length === 0 && (
        <div className="admin-card admin-empty">
          <p>There are no categories yet. Add the first one to show it on the website.</p>
        </div>
      )}

      {status === 'ready' && categories.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
          accessibility={{ announcements: announcements(categoryTitle) }}
        >
          <SortableContext items={categories.map((category) => category.id)} strategy={verticalListSortingStrategy}>
            <ul className="category-list">
              {categories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  expanded={expanded.has(category.id)}
                  onToggle={() => toggleExpanded(category.id)}
                  onEdit={() => setForm({ kind: 'category', initial: category })}
                  onToggleVisibility={() => toggleCategoryVisibility(category)}
                  onDelete={() => setPendingDelete({ kind: 'category', entity: category })}
                >
                  <ItemList
                    category={category}
                    onItemDragEnd={(event) => handleItemDragEnd(category, event)}
                    onAdd={() => setForm({ kind: 'item', initial: null, category })}
                    onEdit={(item) => setForm({ kind: 'item', initial: item, category })}
                    onToggleVisibility={(item) => toggleItemVisibility(category, item)}
                    onDelete={(item) => setPendingDelete({ kind: 'item', entity: item, category })}
                  />
                </SortableCategory>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {form && (
        <ServiceFormModal
          kind={form.kind}
          initial={form.initial}
          categoryTitle={form.category?.title}
          onSave={saveForm}
          onClose={() => setForm(null)}
        />
      )}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.kind === 'category' ? 'Delete category?' : 'Delete item?'}
        message={
          pendingDelete &&
          (pendingDelete.kind === 'category'
            ? `“${pendingDelete.entity.title}” and its ${pendingDelete.entity.items.length} items will be removed from the website and from this list. The change is recorded in the activity log.`
            : `“${pendingDelete.entity.title}” will be removed from ${pendingDelete.category.title} on the website and from this list. The change is recorded in the activity log.`)
        }
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}

function useSortableRow(id) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return {
    rowProps: {
      ref: setNodeRef,
      style: { transform: CSS.Transform.toString(transform), transition },
      'data-dragging': isDragging || undefined,
    },
    handleProps: { ref: setActivatorNodeRef, ...attributes, ...listeners },
  };
}

function SortableCategory({ category, expanded, onToggle, onEdit, onToggleVisibility, onDelete, children }) {
  const { rowProps, handleProps } = useSortableRow(category.id);
  const panelId = `category-${category.id}-items`;
  const hiddenItems = category.items.filter((item) => !item.isVisible).length;

  return (
    <li className={`category${category.isVisible ? '' : ' is-hidden'}`} {...rowProps}>
      <div className="category__row">
        <button type="button" className="drag-handle" aria-label={`Reorder ${category.title}`} {...handleProps}>
          <Icon name="grip" size={18} />
        </button>
        <button
          type="button"
          className="category__toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <Icon name="chevronDown" size={18} />
          <span className="category__icon">
            <Icon name={category.icon} size={20} />
          </span>
          <span className="category__text">
            <span className="category__title">{category.title}</span>
            <span className="category__meta">
              /services/{category.slug} · {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
              {hiddenItems > 0 && ` (${hiddenItems} hidden)`}
            </span>
          </span>
        </button>
        {!category.isVisible && <span className="badge badge--muted">Hidden</span>}
        <div className="row-actions">
          <button type="button" className="button button--secondary button--xs" onClick={onEdit}>
            <Icon name="pencil" size={16} /> Edit
          </button>
          <button type="button" className="button button--secondary button--xs" onClick={onToggleVisibility}>
            <Icon name={category.isVisible ? 'eyeOff' : 'eye'} size={16} /> {category.isVisible ? 'Hide' : 'Show'}
          </button>
          <button type="button" className="button button--danger-ghost button--xs" onClick={onDelete}>
            <Icon name="trash" size={16} /> Delete
          </button>
        </div>
      </div>
      <div id={panelId} className="category__items" hidden={!expanded}>
        {children}
      </div>
    </li>
  );
}

function ItemList({ category, onItemDragEnd, onAdd, onEdit, onToggleVisibility, onDelete }) {
  const sensors = useDragSensors();
  const titleOf = (id) => category.items.find((item) => item.id === id)?.title ?? 'item';

  return (
    <>
      {category.items.length === 0 ? (
        <p className="category__empty">No items yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onItemDragEnd}
          accessibility={{ announcements: announcements(titleOf) }}
        >
          <SortableContext items={category.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <ul className="item-list" aria-label={`${category.title} items`}>
              {category.items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  categorySlug={category.slug}
                  onEdit={() => onEdit(item)}
                  onToggleVisibility={() => onToggleVisibility(item)}
                  onDelete={() => onDelete(item)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      <button type="button" className="button button--ghost button--xs category__add" onClick={onAdd}>
        <Icon name="plus" size={16} /> Add item
      </button>
    </>
  );
}

function SortableItem({ item, categorySlug, onEdit, onToggleVisibility, onDelete }) {
  const { rowProps, handleProps } = useSortableRow(item.id);
  return (
    <li className={`item${item.isVisible ? '' : ' is-hidden'}`} {...rowProps}>
      <button type="button" className="drag-handle" aria-label={`Reorder ${item.title}`} {...handleProps}>
        <Icon name="grip" size={16} />
      </button>
      <span className="item__text">
        <span className="item__title">{item.title}</span>
        <span className="item__meta">
          /services/{categorySlug}/{item.slug}
        </span>
      </span>
      {!item.isVisible && <span className="badge badge--muted">Hidden</span>}
      <div className="row-actions row-actions--icons">
        <button type="button" className="icon-action" onClick={onEdit} aria-label={`Edit ${item.title}`} title="Edit">
          <Icon name="pencil" size={16} />
        </button>
        <button
          type="button"
          className="icon-action"
          onClick={onToggleVisibility}
          aria-label={`${item.isVisible ? 'Hide' : 'Show'} ${item.title}`}
          title={item.isVisible ? 'Hide' : 'Show'}
        >
          <Icon name={item.isVisible ? 'eyeOff' : 'eye'} size={16} />
        </button>
        <button
          type="button"
          className="icon-action icon-action--danger"
          onClick={onDelete}
          aria-label={`Delete ${item.title}`}
          title="Delete"
        >
          <Icon name="trash" size={16} />
        </button>
      </div>
    </li>
  );
}

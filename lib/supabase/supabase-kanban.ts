
import { getSupabase } from './supabaseClient';
import { KanbanColumn, KanbanCard } from '@/stores/useDataStore';

const supabase = getSupabase();

export async function fetchKanbanForUser(userId: string): Promise<KanbanColumn[]> {
  const { data: cols, error: colErr } = await supabase
    .from('kanban_columns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (colErr) throw new Error(colErr.message || 'Failed to fetch columns');

  const { data: cards, error: cardsErr } = await supabase
    .from('kanban_cards')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true });

  if (cardsErr) throw new Error(cardsErr.message || 'Failed to fetch cards');

  const columns: KanbanColumn[] = (cols || []).map((c: any) => ({
    id: String(c.id),
    title: c.title,
    cards: [],
  }));

  const cardMap = {} as Record<string, KanbanCard[]>;
  (cards || []).forEach((r: any) => {
    const card: KanbanCard = {
      id: String(r.id),
      title: r.title,
      description: r.description || undefined,
      projectId: r.project_id || undefined,
      priority: (r.priority as any) || 'medium',
      dueDate: r.due_date ? String(r.due_date) : undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
    cardMap[r.column_id] = cardMap[r.column_id] || [];
    cardMap[r.column_id].push(card);
  });

  return columns.map((col) => ({ ...col, cards: cardMap[col.id] || [] }));
}

export async function createColumnForUser(userId: string, title: string): Promise<KanbanColumn> {
  // FIXED: Explicit UUID pass kar rahe hain taaki null constraint fail na ho
  const row = { 
    id: crypto.randomUUID(), 
    user_id: userId, 
    title 
  };

  const { data, error } = await supabase
    .from('kanban_columns')
    .insert([row])
    .select()
    .single();

  if (error) throw new Error(error.message || 'Failed to create column');
  return { id: String(data.id), title: data.title, cards: [] };
}

export async function updateColumnForUser(id: string, userId: string, patch: Partial<KanbanColumn>) {
  const row: any = {};
  if (patch.title !== undefined) row.title = patch.title;
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('kanban_columns')
    .update(row)
    .match({ id, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message || 'Failed to update column');
  return { id: String(data.id), title: data.title } as KanbanColumn;
}

export async function deleteColumnForUser(id: string, userId: string) {
  const { error } = await supabase
    .from('kanban_columns')
    .delete()
    .match({ id, user_id: userId });

  if (error) throw new Error(error.message || 'Failed to delete column');
  return true;
}

export async function createCardForUser(
  userId: string,
  columnId: string,
  payload: Partial<KanbanCard>
): Promise<KanbanCard> {
  const { data: posData, error: posErr } = await supabase
    .from('kanban_cards')
    .select('position')
    .eq('column_id', columnId)
    .order('position', { ascending: false })
    .limit(1);

  if (posErr) throw new Error(posErr.message || 'Failed to calculate card position');

  const maxPos = posData && posData[0] && typeof posData[0].position === 'number' ? posData[0].position : -1;
  const position = maxPos + 1;

  // FIXED: Card mein bhi explicit UUID add kar diya
  const row: any = {
    id: crypto.randomUUID(),
    user_id: userId,
    column_id: columnId,
    project_id: (payload as any).projectId || null,
    title: payload.title,
    description: payload.description || null,
    priority: (payload as any).priority || null,
    due_date: (payload as any).dueDate || null,
    position,
  };

  const { data, error } = await supabase
    .from('kanban_cards')
    .insert([row])
    .select()
    .single();

  if (error) throw new Error(error.message || 'Failed to create card');

  return {
    id: String(data.id),
    title: data.title,
    description: data.description || undefined,
    projectId: data.project_id || undefined,
    priority: (data.priority as any) || 'medium',
    dueDate: data.due_date ? String(data.due_date) : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateCardForUser(id: string, userId: string, patch: Partial<KanbanCard>) {
  const row: any = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.priority !== undefined) row.priority = patch.priority;
  if (patch.dueDate !== undefined) row.due_date = patch.dueDate;
  if (patch.projectId !== undefined) row.project_id = patch.projectId;
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('kanban_cards')
    .update(row)
    .match({ id, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message || 'Failed to update card');

  return {
    id: String(data.id),
    title: data.title,
    description: data.description || undefined,
    projectId: data.project_id || undefined,
    priority: (data.priority as any) || 'medium',
    dueDate: data.due_date ? String(data.due_date) : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as KanbanCard;
}

export async function deleteCardForUser(id: string, userId: string) {
  const { error } = await supabase
    .from('kanban_cards')
    .delete()
    .match({ id, user_id: userId });

  if (error) throw new Error(error.message || 'Failed to delete card');
  return true;
}

export async function moveCardForUser(cardId: string, userId: string, toColumnId: string, toIndex = 0) {
  const { data: cardRow, error: cardErr } = await supabase
    .from('kanban_cards')
    .select('*')
    .match({ id: cardId, user_id: userId })
    .single();

  if (cardErr) throw new Error(cardErr.message || 'Card not found');
  const fromColumn = cardRow.column_id;

  const { error: updErr } = await supabase
    .from('kanban_cards')
    .update({ column_id: toColumnId })
    .match({ id: cardId, user_id: userId });

  if (updErr) throw new Error(updErr.message || 'Failed to reassign card column');

  const { data: fromCards } = await supabase
    .from('kanban_cards')
    .select('*')
    .eq('column_id', fromColumn)
    .eq('user_id', userId)
    .order('position', { ascending: true });

  const { data: toCards } = await supabase
    .from('kanban_cards')
    .select('*')
    .eq('column_id', toColumnId)
    .eq('user_id', userId)
    .order('position', { ascending: true });

  const fromList = (fromCards || []).filter((c: any) => String(c.id) !== String(cardId));
  const targetList = (toCards || []).filter((c: any) => String(c.id) !== String(cardId));

  targetList.splice(toIndex, 0, cardRow);

  const updates: any[] = [];
  fromList.forEach((c: any, idx: number) => {
    updates.push({ id: c.id, position: idx });
  });
  targetList.forEach((c: any, idx: number) => {
    updates.push({ id: c.id, position: idx, column_id: String(c.column_id || toColumnId) });
  });

  for (const u of updates) {
    const upd: any = { position: u.position, updated_at: new Date().toISOString() };
    if (u.column_id) upd.column_id = u.column_id;
    await supabase.from('kanban_cards').update(upd).match({ id: u.id, user_id: userId });
  }

  return true;
}
import { getSupabase } from './supabaseClient';
import { KanbanColumn, KanbanCard } from '@/stores/useDataStore';

const supabase = getSupabase();

export async function fetchKanbanForUser(userId: string): Promise<KanbanColumn[]> {
  // fetch columns and cards, then assemble
  const { data: cols, error: colErr } = await supabase.from('kanban_columns').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (colErr) throw colErr;
  const { data: cards, error: cardsErr } = await supabase.from('kanban_cards').select('*').eq('user_id', userId).order('position', { ascending: true });
  if (cardsErr) throw cardsErr;

  const columns: KanbanColumn[] = (cols || []).map((c: any) => ({ id: String(c.id), title: c.title, cards: [] }));
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

  return columns.map(col => ({ ...col, cards: cardMap[col.id] || [] }));
}

export async function createColumnForUser(userId: string, title: string): Promise<KanbanColumn> {
  const id = 'col-' + Math.random().toString(36).slice(2, 9);
  const row = { id, user_id: userId, title };
  const { data, error } = await supabase.from('kanban_columns').insert([row]).select().single();
  if (error) throw error;
  return { id: String(data.id), title: data.title, cards: [] };
}

export async function updateColumnForUser(id: string, userId: string, patch: Partial<KanbanColumn>) {
  const row: any = {};
  if (patch.title !== undefined) row.title = patch.title;
  row.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('kanban_columns').update(row).match({ id, user_id: userId }).select().single();
  if (error) throw error;
  return { id: String(data.id), title: data.title } as KanbanColumn;
}

export async function deleteColumnForUser(id: string, userId: string) {
  const { data, error } = await supabase.from('kanban_columns').delete().match({ id, user_id: userId });
  if (error) throw error;
  return true;
}

export async function createCardForUser(userId: string, columnId: string, payload: Partial<KanbanCard>): Promise<KanbanCard> {
  // compute position = max(position)+1 in column
  const { data: posData, error: posErr } = await supabase.from('kanban_cards').select('position').eq('column_id', columnId).order('position', { ascending: false }).limit(1);
  if (posErr) throw posErr;
  const maxPos = (posData && posData[0] && typeof posData[0].position === 'number') ? posData[0].position : -1;
  const position = maxPos + 1;
  const id = payload.id || 'card-' + Math.random().toString(36).slice(2, 9);
  const row: any = {
    id,
    user_id: userId,
    column_id: columnId,
    project_id: (payload as any).projectId || null,
    title: payload.title,
    description: payload.description || null,
    priority: (payload as any).priority || null,
    due_date: (payload as any).dueDate || null,
    position,
  };
  const { data, error } = await supabase.from('kanban_cards').insert([row]).select().single();
  if (error) throw error;
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
  const { data, error } = await supabase.from('kanban_cards').update(row).match({ id, user_id: userId }).select().single();
  if (error) throw error;
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
  const { data, error } = await supabase.from('kanban_cards').delete().match({ id, user_id: userId });
  if (error) throw error;
  return true;
}

export async function moveCardForUser(cardId: string, userId: string, toColumnId: string, toIndex = 0) {
  // Update the moved card column and then recompute positions for source and target columns
  // Fetch the card to know its current column
  const { data: cardRow, error: cardErr } = await supabase.from('kanban_cards').select('*').match({ id: cardId, user_id: userId }).single();
  if (cardErr) throw cardErr;
  const fromColumn = cardRow.column_id;

  // set the moved card column_id to toColumnId (temporary position -1)
  const { error: updErr } = await supabase.from('kanban_cards').update({ column_id: toColumnId }).match({ id: cardId, user_id: userId });
  if (updErr) throw updErr;

  // Recompute positions in both columns
  // Fetch cards for fromColumn and toColumn ordered by position
  const { data: fromCards } = await supabase.from('kanban_cards').select('*').eq('column_id', fromColumn).eq('user_id', userId).order('position', { ascending: true });
  const { data: toCards } = await supabase.from('kanban_cards').select('*').eq('column_id', toColumnId).eq('user_id', userId).order('position', { ascending: true });

  // Build new arrays excluding the moved card from source and inserting at toIndex in target
  const fromList = (fromCards || []).filter((c: any) => String(c.id) !== String(cardId));
  const targetList = (toCards || []).filter((c: any) => String(c.id) !== String(cardId));

  // If moving within same column, handle accordingly
  if (fromColumn === toColumnId) {
    // insert at toIndex within same list
    let movingCard: any = null;
    // find moving card in original list (before we updated column_id) - fetch original cardRow
    movingCard = cardRow;
    targetList.splice(toIndex, 0, movingCard);
  } else {
    // moved card should be inserted into targetList at toIndex
    targetList.splice(toIndex, 0, cardRow);
  }

  // Write new positions for fromList and targetList
  const updates: any[] = [];
  fromList.forEach((c: any, idx: number) => { updates.push({ id: c.id, position: idx }); });
  targetList.forEach((c: any, idx: number) => { updates.push({ id: c.id, position: idx, column_id: String(c.column_id || toColumnId) }); });

  // perform batched updates (multiple calls)
  for (const u of updates) {
    // Only update position (and column_id for targetList items if needed)
    const upd: any = { position: u.position, updated_at: new Date().toISOString() };
    if (u.column_id) upd.column_id = u.column_id;
    await supabase.from('kanban_cards').update(upd).match({ id: u.id, user_id: userId });
  }

  return true;
}

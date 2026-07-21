import React from 'react';
import ActivityForm from './ActivityForm';
import { createActivityAction } from '@/app/actions/activity';

export default function ActivityFormWrapper({ userId }: { userId: string }) {
  // createActivityAction is a server action (uses 'use server') and can be passed down to client components
  // However, we will wrap a small server-side handler that calls it. For Next's server-action rules, it's safe to pass server actions as props.
  const handle = createActivityAction as unknown as (data: any) => Promise<any>;

  return <ActivityForm userId={userId} />;
}

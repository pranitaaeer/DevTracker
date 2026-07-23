'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDataStore } from '@/stores/useDataStore';
import ProjectsList from '@/components/ProjectsList';
import JournalList from '@/components/JournalList';
import AchievementsList from '@/components/AchievementsList';
import Card from '@/components/Card';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import AnimatedNumber from '@/components/AnimatedNumber';
import {
  Plus,
  Sparkles,
  Flame,
  Activity,
  Code2,
  FolderGit2
} from 'lucide-react';

import { fetchActivitiesForUser } from "@/lib/supabase/supabase-activities";
import { mockUser } from "@/lib/mockData";


const AnalyticsChart = dynamic(
  () => import('@/components/AnalyticsChart'),
  {
    ssr:false,
    loading:()=>(
      <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse"/>
    )
  }
);


const Heatmap = dynamic(
  ()=>import('@/components/Heatmap'),
  {
    ssr:false,
    loading:()=>(
      <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse"/>
    )
  }
);



export default function DashboardPage(){

const activities = useDataStore(s=>s.activities);
const projects = useDataStore(s=>s.projects);
const journal = useDataStore(s=>s.journal);
const interviews = useDataStore(s=>s.interviews);
const achievements = useDataStore(s=>s.achievements);
const aiTasks = useDataStore(s=>s.aiTasks);



const weekly = useMemo(()=>{

const days=[
'Sun',
'Mon',
'Tue',
'Wed',
'Thu',
'Fri',
'Sat'
];


const map:Record<string,number>={};


days.forEach(
day=>map[day]=0
);


activities.forEach(a=>{

const d=new Date(a.createdAt);

map[days[d.getDay()]] +=
(a.durationMin||0)/60;

});


return days.map(day=>({
day,
hours:
Math.round(map[day]*10)/10
}));

},[activities]);



const todayActivities =
useMemo(
()=>activities.slice(0,3),
[activities]
);



const totalHours =
Math.round(
activities.reduce(
(s,a)=>s+(a.durationMin||0),
0
)/60*10
)/10;



const [contributions,setContributions]=useState<any>({});



useEffect(()=>{

async function load(){

const data =
await fetchActivitiesForUser(
mockUser.id
);


const map:any={};


data.forEach(activity=>{

const date =
activity.occurredAt.split("T")[0];


map[date] =
(map[date]||0)+1;


});


setContributions(map);

}


load();


},[]);





return (

<main
className="
min-h-screen
bg-zinc-100
dark:bg-[#0d1117]
text-black
dark:text-white
"
>


<section
className="
relative overflow-hidden
rounded-3xl
border
border-zinc-200
dark:border-zinc-800
bg-white
dark:bg-[#0d1117]
p-8
mb-8
shadow-2xl
"
>


<div className="
absolute inset-0
bg-gradient-to-br
from-emerald-500/10
via-transparent
to-purple-500/10
"/>



<div
className="
relative flex flex-col xl:flex-row
justify-between gap-8
"
>


<div>


<div
className="
flex items-center gap-2
text-sm
text-zinc-500
dark:text-zinc-400
"
>

<Activity
size={16}
className="text-emerald-400"
/>

Developer Dashboard

</div>




<h1
className="
mt-4
text-5xl
font-bold
tracking-tight
bg-gradient-to-r
from-black
dark:from-white
via-zinc-600
dark:via-zinc-200
to-zinc-400
bg-clip-text
text-transparent
"
>
DevTrack
</h1>




<p
className="
mt-3
max-w-lg
text-zinc-600
dark:text-zinc-400
"
>
Your personal developer operating system to track coding progress, projects, achievements and growth.
</p>




<div className="flex gap-3 mt-7">


<button
className="
flex items-center gap-2
rounded-xl
bg-black
dark:bg-white
text-white
dark:text-black
px-5 py-2.5
text-sm
font-semibold
transition
hover:scale-105
"
>

<Plus size={17}/>
Add Activity

</button>




<button
className="
flex items-center gap-2
rounded-xl
border
border-zinc-300
dark:border-zinc-700
bg-white
dark:bg-[#0d1117]
text-black
dark:text-white
px-5 py-2.5
text-sm
font-medium
hover:bg-zinc-100
dark:hover:bg-zinc-800
transition
"
>

<Sparkles size={17}/>
AI Assistant

</button>


</div>


</div>





<div
className="
flex flex-wrap gap-4 items-start
"
>


<StatCard
icon={<Code2 size={18}/>}
title="Coding Hours"
value={<AnimatedNumber value={totalHours}/>}
/>



<StatCard
icon={<FolderGit2 size={18}/>}
title="Projects"
value={projects.length}
/>



<StatCard
icon={<Activity size={18}/>}
title="Activities"
value={activities.length}
/>



</div>


</div>


</section>





<div className="
grid xl:grid-cols-3
gap-6
">


<div
className="
xl:col-span-2
space-y-6
"
>


<Card title="Today's Progress">


{
todayActivities.length===0

?

<LoadingSkeleton className="h-32"/>

:

<div className="
grid md:grid-cols-3 gap-4
">


{
todayActivities.map(a=>(


<div
key={a.id}
className="
rounded-2xl
border
border-zinc-200
dark:border-zinc-800
bg-white
dark:bg-[#111827]
p-5
"
>


<p
className="
text-sm
font-medium
text-black
dark:text-zinc-100
"
>
{a.title}
</p>



<span
className="
text-xs
text-zinc-500
"
>
{a.durationMin}m
</span>



<p
className="
text-xs
text-zinc-500
mt-4
"
>
{new Date(a.createdAt).toLocaleString()}
</p>


</div>


))

}


</div>


}


</Card>



<Card title="Projects">
<ProjectsList projects={projects}/>
</Card>



<Card title="Developer Journal">
<JournalList entries={journal}/>
</Card>



</div>





<aside className="space-y-6">


<Card title="GitHub Contribution">

<Heatmap contributions={contributions}/>

</Card>



<Card title="Weekly Coding Hours">

<AnalyticsChart data={weekly}/>

</Card>



</aside>


</div>






<section
className="
mt-6
grid lg:grid-cols-3
gap-6
"
>


<Card title="Interview Pipeline">


<div className="flex items-center gap-4">


<div
className="
h-14 w-14
rounded-2xl
bg-emerald-500/10
flex items-center justify-center
"
>

<Flame
className="text-emerald-400"
/>

</div>



<div>

<h2 className="text-3xl font-bold">
{interviews.length}
</h2>


<p className="
text-sm
text-zinc-500
">
Upcoming interviews
</p>


</div>


</div>


</Card>





<Card title="Achievements">

<AchievementsList items={achievements}/>

</Card>





<Card title="AI Tasks">


<div className="space-y-3">


{
aiTasks.map(t=>(

<div
key={t.id}
className="
flex items-center gap-3
rounded-xl
border
border-zinc-200
dark:border-zinc-800
bg-white
dark:bg-[#111827]
px-4 py-3
text-sm
text-black
dark:text-zinc-300
"
>


<span
className="
h-2 w-2 rounded-full
bg-emerald-400
"
/>


{t.title}


</div>

))

}


</div>


</Card>



</section>




</main>

)


}





function StatCard({
title,
value,
icon
}:{
title:string;
value:any;
icon:React.ReactNode;
}){


return (

<div
className="
min-w-[150px]
rounded-2xl
border
border-zinc-200
dark:border-zinc-800
bg-white
dark:bg-[#111827]
px-5 py-4
shadow-lg
"
>


<div
className="
flex items-center gap-2
text-zinc-500
text-xs
"
>

{icon}

{title}

</div>




<div
className="
mt-3
text-3xl
font-bold
text-black
dark:text-white
"
>

{value}

</div>


</div>

)

}
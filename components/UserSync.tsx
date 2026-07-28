"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUser } from "@/lib/clerkSync";

export default function UserSync(){

    const {user,isLoaded}=useUser();

    useEffect(()=>{

        if(!isLoaded || !user) return;

        syncUser(user);

    },[user,isLoaded]);

    return null;
}
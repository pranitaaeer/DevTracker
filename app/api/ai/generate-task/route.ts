import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const prompt = `
    You are a senior AI coding mentor and productivity assistant.

    Here are the user's recent development activities:

    ${JSON.stringify(body.activities, null, 2)}

    Analyze the activities carefully.

    Determine:
    - Which programming languages the user is actively using.
    - Which frameworks/libraries are being used.
    - Which technologies or tools appear frequently.
    - What kind of project the user is working on.

    Based on that analysis, generate ONE practical next task.

    The task may belong to ANY of these categories:

    1. Continue the current project
    2. Fix a likely bug
    3. Refactor existing code
    4. Learn a missing concept
    5. Build a useful feature
    6. Practice DSA related to the current stack
    7. Improve React/Next.js performance
    8. Improve backend/API
    9. Improve database design
    10. Improve security
    11. Write tests
    12. Improve Git/GitHub workflow
    13. Improve TypeScript types
    14. Learn an advanced concept used in the project

    Rules:

    - NEVER repeat the user's recent activities.
    - Suggest the NEXT logical step.
    - If the user mainly works in React, Next.js, Node.js, TypeScript, JavaScript, Supabase, MongoDB, SQL, etc., prefer tasks related to those technologies.
    - If coding activity is low, generate a DSA or programming practice task.
    - Prefer project-based learning over theory.
    - Keep the task realistic (30–90 minutes).
    - Title must be short.
    - Details should clearly explain what to build or learn.

    Return ONLY valid JSON.

    {
      "title": "string",
      "details": "string"
    }
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3.1",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
            }),
        });
        console.log("response", response);
        if (!response || !response.ok) {
            console.log("err")
        }

        const result = await response.json();
        console.log("result", result);
        const text =
            result.choices?.[0]?.message?.content || "{}";

        console.log("Raw AI Response:", text);

        // Remove ```json and ```
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log("Cleaned:", cleaned);

        const task = JSON.parse(cleaned);

        console.log("Task:", task);


        return NextResponse.json(task);
    } catch (err) {
        console.error(err);
        console.log("error:", err)

        return NextResponse.json(
            {
                error: "Failed to generate AI task",
            },
            {
                status: 500,
            }
        );
    }
}
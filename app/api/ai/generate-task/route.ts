import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const prompt = `
            You are a productivity assistant.

            User recent activities:
            ${JSON.stringify(body.activities)}

            Generate ONE useful developer task.

            Return ONLY valid JSON.

            {
            "title":"",
            "details":""
            }
            `;

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error("DeepSeek request failed");
        }

        const result = await response.json();

        const text =
            result.choices?.[0]?.message?.content || "{}";

        const task = JSON.parse(text);

        return NextResponse.json(task);
    } catch (err) {
        console.error(err);

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
import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    const { prompt } = await request.json();

    try {
        await connectToDB();

        // Check if the prompt already exists
        const existingPrompt = await Prompt.findOne({ prompt });

        return new Response(JSON.stringify({ exists: !!existingPrompt }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error checking prompt redundancy", { status: 500 });
    }
};

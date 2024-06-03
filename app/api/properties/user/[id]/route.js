import connectDB from "@/config/database";
import Property from "@/models/Property";



export const GET = async (req, { params }) => {
    try {
        await connectDB();
        const userId = params.id;
        if (!userId) {
            return new Response("User id is required", { status: 400 })
        }

        const properties = await Property.find({ owner: userId });
        return new Response(JSON.stringify(properties), { status: 200 })

    } catch (error) {
        console.log(error);
        return new Response("Error", { status: 500 })
    }
}
import { getUserSession } from "@/app/utils/getServerSession";
import connectDB from "@/config/database"
import Message from "@/models/Message";

export const GET = async (req) => {
    try {
        await connectDB();
        const session = await getUserSession();

        if (!session) {
            return new Response(JSON.stringify("Not authorised..."), {
                status: 401
            })
        }

        const { userId } = session;
        const unreadMessagesCount = await Message.countDocuments({ receiver: userId, read: false });

        
        return new Response(JSON.stringify({ count: unreadMessagesCount }), { status: 200 })

    } catch (error) {
        console.log(error);
        return new Response("Error", { status: 500 })
    }
}
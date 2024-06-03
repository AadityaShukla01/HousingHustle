import { getUserSession } from "@/app/utils/getServerSession";
import connectDB from "@/config/database"
import Message from "@/models/Message";
import User from "@/models/User";


export const dynamic = 'force-dynamic';


export const POST = async (req) => {
    try {
        await connectDB();

        const { name, email, phone, message, property, receiver } = await req.json();
        const sessionUser = await getUserSession();

        console.log("ok ", sessionUser);
        if (!sessionUser || !sessionUser?.user) {
            return new Response(JSON.stringify({ message: "User not authorised..." }), {
                status: 401
            });
        }
        const { user } = sessionUser;

        // cannot send message to self

        if (user.id === receiver) {
            return new Response(JSON.stringify({ message: "Cannot send message to yourself" }), {
                status: 401
            });
        }

        const newMessage = new Message({
            sender: user.id,
            receiver,
            property,
            name,
            email,
            body: message,
            phone,

        })

        await newMessage.save();
        return new Response(JSON.stringify({ message: 'Message sent' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Error' }), {
            status: 500
        });
    }
}


export const GET = async (req) => {
    try {
        await connectDB();

        const session = await getUserSession();

        if (!session) {
            return new Response(JSON.stringify({ message: "Not authorised..." }), { status: 401 });
        }

        const { userId } = session;
        // from sender fetch its username & from property fetch its name
        //sort so that latest unread messages are at top
        const readMessages = await Message.find({ receiver: userId, read: true }).sort({ createdAt: -1 }).populate('sender', 'username')
            .populate('property', 'name');

        const unreadMessages = await Message.find({ receiver: userId, read: false }).sort({ createdAt: -1 }).populate('sender', 'username')
            .populate('property', 'name');

        const messages = [...unreadMessages, ...readMessages];
        return new Response(JSON.stringify(messages), {
            status: 200
        });

    } catch (error) {
        console.log(error);
        return new Response("Error fetching messages", {
            status: 500
        });
    }
}
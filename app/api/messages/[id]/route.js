import { getUserSession } from "@/app/utils/getServerSession";
import connectDB from "@/config/database"
import Message from "@/models/Message";


export const dynamic = "force-dynamic";


export const PUT = async (req, { params }) => {
    try {
        await connectDB();
        const session = await getUserSession();

        if (!session) {
            return new Response(JSON.stringify({ message: "User not authorised...." }), { status: 401 });
        }
        const { id } = params;
        const data = await req.json();
        console.log(data)
        await Message.findByIdAndUpdate(id, { read: data.read });

        return new Response(JSON.stringify("Ok"));
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "error" }));
    }
}


export const DELETE = async (req, { params }) => {
    try {
        await connectDB();

        const { id } = params;

        await Message.findByIdAndDelete(id);

        return new Response(JSON.stringify({ message: "Message deleted.." }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
    }
}
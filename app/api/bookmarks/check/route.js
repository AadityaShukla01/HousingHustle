import { getUserSession } from "@/app/utils/getServerSession";
import connectDB from "@/config/database"
import User from "@/models/User";

// to remove an error in vercel deployment
export const dynamic = 'force-dynamic';


export const POST = async (req) => {
    try {
        await connectDB();
        const session = await getUserSession();

        const { userId } = session;
        const { id } = await req.json();

        if (!userId) {
            return new Response("User ID is required...", {
                status: 401,
            })
        }

        // check if property is already bookmarked no need to bookmark same property again
        const user = await User.findOne({ _id: userId });
        let isBookmark = await user.bookmarks.includes(id);

        return new Response(JSON.stringify({ isBookmark }), {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong....', {
            status: 500
        })
    }
}
import { getUserSession } from "@/app/utils/getServerSession";
import connectDB from "@/config/database"
import Property from "@/models/Property";
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
        const user = await User.findOne({ _id: userId });

        // check if property is already bookmarked no need to bookmark same property again
        let isBookmark = await user.bookmarks.includes(id);

        let message;

        if (isBookmark) {
            // if already bookmarked remove the property from bookmarks

            user.bookmarks.pull(id);
            message = 'Bookmark removed...';
            isBookmark = false;
        }
        else {
            // not bookmark
            // bookmark it
            user.bookmarks.push(id);
            message = "Property bookmarked successfully...";
            isBookmark = true;
        }
        // asve changes to database
        await user.save();
        return new Response(JSON.stringify({ message, isBookmark }), {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong....', {
            status: 500
        })
    }
}

// get properties (bookmarked properties)
export const GET = async () => {
    try {
        await connectDB();

        const session = await getUserSession();

        const { userId } = session;

        const user = await User.findById(userId);
        const bookmarks = user.bookmarks;

        //from properties find those properties who property_id is in users bookmarks
        const properties = await Property.find({ _id: { $in: bookmarks } });
        return Response.json(properties, {
            status: 200
        })
    } catch (error) {
        console.log(error);
    }
}
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            //NOT COMPULSORY BUT PROVIDES THE FUNCTIONALITY TO LOGIN FROM A DIFFERENT ACCOUNT EVERY TIME YOU CLICK LOGIN
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        // invoked on successful signin
        async signIn({ profile }) {
            // 1. connect to db
            await connectDB();
            // 2. check if user exists
            const user = await User.findOne({ email: profile.email })
            // 3. if not add user to db
            if (!user) {
                const username = profile.name.slice(0, 20);
                const email = profile.email;

                await User.create({
                    email,
                    username,
                    image: profile.picture
                })
            }
            // 4. return true to allow sign in
            return true;


        },
        // modifies the session object
        async session({ session }) {
            // 1. get the user from db
            const user = await User.findOne({ email: session.user.email })
            // 2. assign userId to session
            session.user.id = user._id.toString();
            // 3. return the session
            return session;
        }
    }
}
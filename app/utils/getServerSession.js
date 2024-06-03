
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";

export const getUserSession = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return null;
        }

        return {
            user: session.user,
            userId: session.user.id
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
import { authOptions } from "@/app/utils/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);


// export this function whether get or post request
export {handler as GET, handler as POST};
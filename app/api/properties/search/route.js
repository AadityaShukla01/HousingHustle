import connectDB from "@/config/database"
import Property from "@/models/Property";

export const GET = async (req) => {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const location = searchParams.get('location');
        const propertyType = searchParams.get('propertyType');


        const locationPattern = new RegExp(location, 'i');

        // Match location pattern against database fields
        let query = {
            $or: [
                { name: locationPattern },
                { description: locationPattern },
                { 'location.street': locationPattern },
                { 'location.city': locationPattern },
                { 'location.state': locationPattern },
                { 'location.zipcode': locationPattern },
            ],
        };

        // Only check for property if its not 'All'
        if (propertyType && propertyType !== 'All') {
            const typePattern = new RegExp(propertyType, 'i');
            query.type = typePattern;
        }

        const properties = await Property.find(query);

        return Response.json(properties);
    } catch (error) {
        console.log(error);
        return new Response('error', {
            status: 500
        })
    }
}
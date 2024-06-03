
import connectDB from "@/config/database"
import Property from "@/models/Property";
import { getUserSession } from "@/app/utils/getServerSession";


export const GET = async (req, { params }) => {
    try {
        await connectDB();
        // console.log(params.id)
        const property = await Property.findById(params.id);
        if (!property) {
            return new Response('Property not found...', { status: 404 })
        }
        return new Response(JSON.stringify(property), {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return new Response('Something Went Wrong', { status: 500 });
    }
}



export const DELETE = async (req, { params }) => {
    try {
        await connectDB();
        const id = params.id;
        const property = await Property.findById(params.id);

        const session = await getUserSession();
        const { userId } = session;
        if (!property) {
            return new Response('Property not found...', { status: 404 })
        }
        //verify ownership only owner can delete his property
        if (userId && userId !== property.owner.toString()) {
            return new Response('Only owner can delete property', { status: 401 });
        }

        await property.deleteOne();
        return new Response('Property deleted....', { status: 200 })

    } catch (error) {
        console.log(error);
    }
}


export const PUT = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const session = await getUserSession();
        if (!session || !session.user) {
            return new Response("User id is required...", { status: 401 })
        }

        const { userId } = session;
        const formData = await req.formData();
        const amenities = formData.getAll('amenities');
        const existingProperty = await Property.findById(id);

        if (!existingProperty) {
            return new Response('Propery does not exist', { status: 404 });
        }

        if (userId !== existingProperty.owner.toString()) {
            return new Response('Unauthorised', { status: 401 })
        }
        const propertyData = {
            type: formData.get('type'),
            name: formData.get('name'),
            description: formData.get('description'),
            location: {
                street: formData.get('location.street'),
                city: formData.get('location.city'),
                state: formData.get('location.state'),
                zipcode: formData.get('location.zipcode')
            },
            beds: formData.get('beds'),
            baths: formData.get('baths'),
            square_feet: formData.get('square_feet'),
            amenities,
            rates: {
                weekly: formData.get('rates.weekly'),
                monthly: formData.get('rates.monthly'),
                nightly: formData.get('rates.nightly')
            },
            seller_info: {
                name: formData.get('seller_info.name'),
                email: formData.get('seller_info.email'),
                phone: formData.get('seller_info.phone')
            },
            owner: userId,
            // images -> will do it separately
            // since before db we need to upload to cloudinary
        }
        //update peroperty in db

        const property = await Property.findByIdAndUpdate(id, propertyData);

        return new Response(property, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "error" }), { status: 500 })

    }
}


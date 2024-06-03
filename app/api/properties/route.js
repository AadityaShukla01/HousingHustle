
import { getUserSession } from "@/app/utils/getServerSession";
import connectDB from "@/config/database"
import Property from "@/models/Property";
import cloudinary from "@/config/cloudinary";

export const GET = async (req) => {
    try {
        await connectDB();

        // url will be url?page=2&pageSize=3
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || 1;
        const pageSize = searchParams.get('pageSize') || 3;

        // it is the numbers we want to skip since if i'm in page 2
        // i dont want to see what was in page 1
        const skip = (page - 1) * pageSize;

        const total = await Property.countDocuments({});

        // no of properties you want to skip and number of properties you want to show in this page
        const properties = await Property.find({}).skip(skip).limit(pageSize);

        const result = {
            total, properties
        }
        return new Response(JSON.stringify(result), {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return new Response('Something Went Wrong', { status: 500 });
    }
}


export const POST = async (req) => {
    try {
        await connectDB();

        // after adding property we need to mark user as owner
        // in db so to get user we need session from client

        const session = await getUserSession();
        if (!session || !session.user) {
            return new Response("User id is required...", { status: 401 })
        }

        const { userId } = session;
        const formData = await req.formData();
        //acces amenities and images first since they are more complex(array)
        const amenities = formData.getAll('amenities');
        const images = formData
            .getAll('images')
            .filter((image) => image.name !== '');

        //create propertyData object for database
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

        // upload image to cloudinary
        const imageUploadPromises = [];

        for (const image of images) {
            const imageBuffer = await image.arrayBuffer();
            const imageArray = Array.from(new Uint8Array(imageBuffer));
            const imageData = Buffer.from(imageArray);

            //convert image data to base64
            const imageBase64 = imageData.toString('base64');

            //we converted image file into a format which we can upload to cloudinary

            // now request to upload to cloudinary
            const res = await cloudinary.uploader.upload(
                `data:image/png;base64,${imageBase64}`, {
                folder: 'HousingHustle'
            }
            );

            imageUploadPromises.push(res.secure_url);

        }
        // wait for all images to upload
        const uploadedImages = await Promise.all(imageUploadPromises);
        //add uploaded image to propertyData
        propertyData.images = uploadedImages;

        const newProperty = new Property(propertyData);
        await newProperty.save();

        return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`)
    } catch (error) {
        return new Response(JSON.stringify({ message: "error" }), { status: 500 })

    }
}


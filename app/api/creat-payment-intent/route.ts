import Stripe from "stripe";
import prisma from '@/libs/prismadb'
import { CartProductType } from "@/app/product/[productId]/ProductDetils";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY as string,{
    apiVersion:"2023-10-16"
})
const calculateOrderAmount=(items:CartProductType[])=>{
    const totalPrice=items.reduce((acc,item)=>{
        const itemTotal=item.price * item.quantity;
        return acc+itemTotal;
    },0)
    return totalPrice;
}
export async function POST(request:Request){
    const currentuser= await getCurrentUser()
    if(!currentuser){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    const body=await request.json()
    const{items,payment_intent_id}=body
    const total=calculateOrderAmount(items)*100
    const orderData={
        user:{connect:{id:currentuser.id}},
        amount:total,
        currency:'usd',
        status:"pending",
        deliveryStatus:"pending",
        paymentIntentId:'1',
        products:items,
    }
//     if(payment_intent_id){
//  const current_intent=await stripe.paymentIntents.retrieve(payment_intent_id)
//    if(current_intent){
//     const updated_intent= await stripe.paymentIntents.update(payment_intent_id,{amount:total})
   
//    const[existing_order,update_order]=await Promise.all([
//     prisma.order.findFirst({
//         where:{paymentIntentId:payment_intent_id}
//     }),
//     prisma.order.update({
//         where:{paymentIntentId:payment_intent_id},
//         data:{
//             amount:total,
//             products:items
//         }
//     })
//    ])
//    if(!existing_order){
//     return NextResponse.json({error:"Invalid Payment Intent"},{status:400})
//    }
//    return NextResponse.json({payementIntent:updated_intent})}
// }

// else{
        // const paymentIntent=await stripe.paymentIntents.create({
        //     amount:total,
        //     currency:"usd",
        //     automatic_payment_methods:{enabled:true}
        // })

        orderData.paymentIntentId='1'
        await prisma.order.create({
            data:orderData
        })
    // }
}
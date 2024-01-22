import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(request:Request,{params}:{params:{id:string}}){
    const currentuser=await getCurrentUser()
    if(!currentuser || currentuser.role !=='ADMIN'){
        return NextResponse.error()
    }
    const product=await prisma?.product.delete({
        where:{id:params.id}
    })
    return NextResponse.json(product)
}

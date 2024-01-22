import Container from "@/app/components/Container";
import OrderClient from "./OrderClient";
import getOrders from "@/actions/getOrders";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getOrdersByUserId from "@/actions/getOrdersByUser";

const Orders = async() => {
    const currentUser=await getCurrentUser()

    const orders=await getOrdersByUserId(currentUser!.id)
    if(!currentUser ){
        return <NullData title="Oops! Access denied"/>
    }
    if(!orders){
        return <NullData title="No orders yet..."/>
    }
    return ( <div className="pt-8">
<Container>
    <OrderClient orders={orders}/>
</Container>
    </div> );
}
 
export default Orders;
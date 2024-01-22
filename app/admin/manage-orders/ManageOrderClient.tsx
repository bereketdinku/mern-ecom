"use client"

import { Order, Product, User } from "@prisma/client";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/products/Heading";
import Status from "@/app/components/Status";
import { MdAccessTimeFilled, MdCached, MdClose, MdDelete, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import app from "@/libs/firebase";
import moment from "moment";
interface ManageOrderClientProps{
    orders:ExtendedOrder[]
}
type ExtendedOrder=Order &{
    user:User
}
const ManageOrderClient:React.FC<ManageOrderClientProps> = async({orders}) => {
 let rows:any=[]
 const router=useRouter()
 const storage=getStorage(app)
 if(orders){
    rows=orders.map((order)=>{
        return {
            id:order.id,
            customer:order.user.name,
            amount:formatPrice(order.amount/100),
            paymentStatus:order.status,
            date:moment(order.createDate).fromNow(),
            deliveryStatus:order.deliveryStatus
        }
    });
 }
 const columns:GridColDef[]=[
    {field:'id',headerName:"ID",width:220},
    {field:'customer',headerName:'Customer',width:220},
    {field:'amount',headerName:'Amount(USD)',width:130,renderCell:(params)=>{
        return <div className="font-bold text-slate-800">
{params.row.amount}
        </div>
    }},
    {field:'paymentStatus',headerName:'Payment Status',width:120,renderCell:(params)=>{
        return (
            <div className="font-bold text-slate-800">
   {params.row.paymentStatus==="pending"?(<Status text="pending" icon={MdAccessTimeFilled} bg="bg-teal-200" color="text-teal-700"/>): params.row.paymentStatus==="complete"?(<Status text="complete" icon={MdDeliveryDining} bg="bg-purple-200" color="text-purple-700"/>):<></>}
            </div>
        )
    }},
    {field:'deliveryStatus',headerName:'Delivery Status',width:120,renderCell:(params)=>{
        return (
            <div className="font-bold text-slate-800">
   {params.row.deliveryStatus==="pending"?(<Status text="pending" icon={MdAccessTimeFilled} bg="bg-teal-200" color="text-teal-700"/>): params.row.deliveryStatus==="dispatched"?(<Status text="dispatched" icon={MdDeliveryDining} bg="bg-purple-200" color="text-purple-700"/>):params.row.deliveryStatus==="delivered"?(<Status text="delivered" icon={MdDone} bg="bg-green-400" color="text-green-700"/>):<></>}
            </div>
        )
    }},{
        field:"action",
        headerName:"Actions",
        width:200,
        renderCell:(params)=>{
            return (<div className="flex justify-between gap-4 w-full">
                <ActionBtn icon={MdDeliveryDining} onClick={()=>{
                    handleDispatch(params.row.id,params.row.inStock)
                }}/>
                <ActionBtn icon={MdDelete} onClick={()=>{
                    handleDeliver(params.row.id)
                }}/>
                <ActionBtn icon={MdRemoveRedEye} onClick={()=>{
                    router.push(`/order/${params.row.id}`)
                }}/>
            </div>)
        }
    }
 ]

 const handleDispatch=useCallback((id:string,inStock:boolean)=>{
axios.put('/api/order',{
    id,
    deliveryStatus:"dispatched"
}).then((res)=>{
    toast.success("Order Dispatched");
    router.refresh()
}).catch((err)=>{
    toast.error("Oops! Something went wrong");
    console.log(err);
})
 },[])
 const handleDeliver=useCallback((id:string)=>{
    axios.put("/api/order",{
id,
deliveryStatus:"delivered"
    }).then((res)=>{
        toast.success("Order Delivered");
        router.refresh()
    }).catch((err)=>{
        toast.error("Oops! Something went wrong");
        console.log(err);
    })
 },[])
    return ( <div className="max-w-[1150px] m-auto text-xl">
        <div className="mb-4 mt-8">
            <Heading title="Manage Orders" center/>
        </div>
<div style={{height:600,width:"100%"}}>
<DataGrid  rows={rows} columns={columns} initialState={{
    pagination:{
        paginationModel:{page:0,pageSize:5}
    }
}}
pageSizeOptions={[5,10]}
checkboxSelection
/>
</div>
    </div> );
}
 
export default ManageOrderClient;
"use client"

import { useCart } from "@/hooks/useCart";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Heading from "../components/products/Heading";
import { formatPrice } from "@/utils/formatPrice";
import Button from "../components/Button";
import toast from "react-hot-toast";
interface CheckOutFormProps{
    clientSecret:string,
    handleSetPaymentSuccess:(value:boolean)=>void
}
const CheckOutForm:React.FC<CheckOutFormProps> = ({clientSecret,handleSetPaymentSuccess}) => {
    const{cartTotalAmount,handleclearCart,handleSetPaymentIntent}=useCart()
    const stripe=useStripe()
    const elements=useElements()
    const [isLoadingPrice,setIsLoading]=useState(false);
    const formattedPrice=formatPrice(cartTotalAmount);
    useEffect(()=>{
        // if(!stripe){
        //     return;
        // }
        // if(!clientSecret){
        //     return;
        // }
        
    })
    const handleSubmit=async(e:React.FormEvent)=>{
        if(!stripe || !elements){
            return
        }
        setIsLoading(true)
        stripe.confirmPayment({
            elements,redirect:'if_required'
        }).then(result=>{
            if(!result.error){
                toast.success('Checkout Success')
                handleclearCart()
                handleSetPaymentSuccess(true)
                handleSetPaymentIntent(null)
            }
        })

    }
    return ( <form >
        <div className="mb-6">
            <Heading title="Enter your details to complete checkout"/>

        </div>
        <h2 className="font-semibold mb-2">Address Information</h2>
        <AddressElement options={{
            mode:"shipping",
            allowedCountries:["US","KE"]
        }}/>
        <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
       <PaymentElement id="payment-element" options={{
        layout:"tabs"
       }}/>
       <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total : {formattedPrice}

       </div>
       <Button label={isLoadingPrice?"Processing":"Pay Now"} disabled={isLoadingPrice || !stripe || !elements} onClick={()=>{

       }}/>
    </form> );
}
 
export default CheckOutForm;
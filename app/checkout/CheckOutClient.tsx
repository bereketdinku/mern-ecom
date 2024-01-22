"use client"

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {Elements} from "@stripe/react-stripe-js"
import {StripeElementsOptions,loadStripe} from "@stripe/stripe-js"
import CheckOutForm from "./CheckOutForm";
import Button from "../components/Button";
const stripePromise=loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)
const CheckOutClient = () => {
    const{cartProducts,paymentIntent,handleclearCart,handleSetPaymentIntent}=useCart()
    const[isLoading,setIsLoading]=useState(false)
    const[error,setError]=useState(false)
    const[clientSecret,setClientSecret]=useState('')
    const router =useRouter()
    console.log("paymentIntent",paymentIntent)
    const[paymentSuccess,setPaymentSuccess]=useState(false)
    useEffect(()=>{
        if(cartProducts){
            setIsLoading(true)
            setError(false)
            fetch("/api/creat-payment-intent",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    items:cartProducts,
                    payment_intent_id:'1'
                })
            }).then((res)=>{
                setIsLoading(false)
                setPaymentSuccess(true)
                if(res.status===401){
                    return router.push("/login")
                }
                handleclearCart()
                return res.json()
            }).then((data)=>{
                // setClientSecret(data.paymentIntent.client_secret)
                handleSetPaymentIntent('1')
                setPaymentSuccess(true)
            }).catch((error)=>{
                toast.error("Something went wrong")
            })
        }
    },[cartProducts])
    const options:StripeElementsOptions={
        clientSecret,
        appearance:{
            theme:"stripe",
            labels:"floating"
        }
    }
    const handleSetPaymentSuccess=useCallback((value:boolean)=>{
        setPaymentSuccess(value)
    },[])
   return ( <div className="w-full">
    {/* {clientSecret && cartProducts &&(
        <Elements options={options} stripe={stripePromise}>
<CheckOutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
        </Elements>
    )} */}
    {isLoading && <div className="text-center">Loading Checkout...</div>}
        {error && <div className="text-center text-rose-500">
            Something went wrong...
            </div>}
            {paymentSuccess && (
                <div className="flex items-center flex-col gap-4">
                    <div className="text-teal-500 text-center">
                        Payment Success
                    </div>
                    <div className="max-w-[220px] w-full">
                        <Button label="View Your Orders" onClick={()=>router.push('/order')}/>
                    </div>
                </div>
            )}
    </div> );
}
 
export default CheckOutClient;
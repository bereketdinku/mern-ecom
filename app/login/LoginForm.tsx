"use client"

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Input from "../components/Inputs/Input";
import Heading from "../components/products/Heading";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";
interface LoginFormProps{
    currentUser:SafeUser | null
}
const LoginForm:React.FC<LoginFormProps> = ({currentUser}) => {
    const router=useRouter()
    useEffect(()=>{
        if(currentUser){
            router.push("/cart")
            router.refresh()
        }
    },[])
    const[isLoading,setIsLoading]=useState(false)
    const {register,handleSubmit,formState:{errors}}=useForm<FieldValues>({
        defaultValues:{
            email:"",
            password:""
        }
    })
    const onSubmit:SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true)
        signIn('credentials',{
            ...data,
            redirect:false
        }).then((callback)=>{
            setIsLoading(false)
            if(callback?.ok){
router.push('/cart');
router.refresh()
toast.success("Logged In")
            }

            if(callback?.error){
                toast.error(callback.error)
            }
        })
    }
    if(currentUser){
        return <p className="text-center">LoggedIn. Redirecting...</p>
    }
    return ( 
        <>
        <Heading title="Sign In for BekiShop"/>
    <hr className="bg-slate-300 w-full h-px"/>
    <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
    <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password"/>
   <Button label={isLoading?"Loading":"Sign In"} onClick={handleSubmit(onSubmit)}/>
   <p className="text-sm">
    Do Not have an account?
    <Link href={"/register"}>
Sign Up
    </Link>
   </p>
    </>  );
}
 
export default LoginForm;
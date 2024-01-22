"use client"

import Button from "@/app/components/Button";
import CategoryInput from "@/app/components/Inputs/CategoryInput";
import CustomCheckBox from "@/app/components/Inputs/CustomCheckBox";
import Input from "@/app/components/Inputs/Input";
import SelectColor from "@/app/components/Inputs/SelectColor";
import TextArea from "@/app/components/Inputs/TextArea";
import Heading from "@/app/components/products/Heading";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from'firebase/storage'
import app from "@/libs/firebase";
import { error } from "console";
import axios from "axios";
import { useRouter } from "next/navigation";
export type ImageType = {
    color: String,
    colorCode: String,
    image: File | null

}
export type UploadedImageType = {
    color: String,
    colorCode: String,
    image: string

}
const AddProductForm = () => {
    const router=useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const[images,setImages]=useState<ImageType[]|null>();
    const[isProductCreated,setIsProductCreated]=useState(false)
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            description: "",
            brand: "",
            category: "",
            inStock: false,
            images: [],
            price: ""
        }
    })
    useEffect(()=>{
        setCustomvalue('images',images)
    },[images])
    useEffect(()=>{
        if(isProductCreated){
            reset()
            setImages(null)
            setIsProductCreated(false)

        }
    },[isProductCreated])
    const category = watch('category')
    const setCustomvalue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }
    const addImageToState=useCallback((value:ImageType)=>{
        setImages((prev)=>{
            if(!prev){
                return [value];
            }
            return [...prev,value];
        })
    },[])
    const removeImageFromState=useCallback((value:ImageType)=>{
        setImages((prev)=>{
            if(prev){
                const fiteredImages=prev?.filter((item)=>item.color !== value.color)

            return fiteredImages
            }
            return prev
        },
        
        )
    },[])
    const onSubmit:SubmitHandler<FieldValues>=async(data)=>{
        console.log("product data",data)
        setIsLoading(true)
        let uploadedImage:UploadedImageType[]=[]
        if(!data.category){
            setIsLoading(false)
            console.log('category is not selected')
            return toast.error("Category is not selected")
        }
        if(!data.images || data.images.length==0){
            setIsLoading(false);
            console.log('No selected Images')
            return toast.error('No selected Images')
        }
        const handleImageupload=async()=>{
            toast('creating product,please wait...')
            try {
                for(const item of data.images){
                    if(item.image){
                        const fileName=new Date().getTime()+'-'+item.image.name;
                        const storage=getStorage(app)
                        const storageRef=ref(storage,`products/${fileName}`)
                        const uploadTask=uploadBytesResumable(storageRef,item.image)
                        await new Promise<void>((resolve,reject)=>{
                            uploadTask.on('state_changed',(snapshot)=>{
const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
switch(snapshot.state){
    case 'paused':console.log('Upload is'+progress+'%done');
    break;
    case 'running':
        console.log('Upload is running');
        break;
}
                            },(error)=>{
                                console.log('Error uploading image',error)
                                reject(error)
                            },
                            ()=>{
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                                   uploadedImage.push({
                                    ...item,
                                    image:downloadUrl
                                   })
                                    console.log('File available at',downloadUrl);
                                    resolve()
                                }).catch((error)=>{
                                   console.log('Error getting the downolad URL',error)
                                   reject(error); 
                                })
                            }
                            
                            )
                        })
                    }
                }
            } catch (error) {
                setIsLoading(false)
                console.log('Error handling image uploads',error)
                return toast.error('Error handling image uploads')
            }
        }
        await handleImageupload()
        const productData={...data,images:uploadedImage}
        console.log('newproductData',productData)
         axios.post('/api/product',productData).then(()=>{
            toast.success('Product created')
            setIsProductCreated(true)
            router.refresh()
         }).catch((error)=>{
            toast.error('Something went wrong when saving product to db')
         }).finally(()=>{
            setIsLoading(false)
         })
    }
    return (<>
        <Heading title="Add a Product" />
        <Input label="Name" id="name" disabled={isLoading} register={register} errors={errors} required />
        <Input label="Price" id="price" disabled={isLoading} register={register} errors={errors} required type="number" />
        <Input label="Brand" id="brand" disabled={isLoading} register={register} errors={errors} required />
        <TextArea label="Description" id="description" disabled={isLoading} register={register} errors={errors} required />
        <CustomCheckBox id="inStock" register={register} label="This Product is in stock" />
        <div className="w-full font-medium">
            <div className="mb-2 font-semibold">Select a Category</div>
            <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => {
                    if (item.label === "All") {
                        return null;
                    }
                    return <div key={item.label} className="col-span">
                        <CategoryInput onClick={(category) => setCustomvalue('category', category)} selected={category === item.label} label={item.label} icon={item.icon} />
                    </div>
                })}
            </div>
        </div>
        <div className="w-full flex flex-col flex-wrap gap-4">

            <div >
                <div className="font-bold">
                    Select the available product colors and upload their images.
                </div>
                <div className="text-sm">
                    you must upload an image for each of the color selected otherwise your color selection will be ignored
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {colors.map((item, index) => {
                    return <SelectColor key={index} item={item} addImageToState={addImageToState} removeImageFromState={() =>removeImageFromState } isProductCreated={isProductCreated} />
                })}
            </div>
        </div>
        <Button label={isLoading?"Loading...":"Add Product"} onClick={handleSubmit(onSubmit)}/>
    </>);
}

export default AddProductForm;
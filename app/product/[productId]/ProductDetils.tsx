"use client"

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { MdCheckCircle } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Horizontal=()=>{
    return <hr className="w-[30%] my-2"/>
}
interface ProductDetailProps{
    product:any
}
export type CartProductType={
    id:string,
    name:string,
    description:string,
    category:string,
    brand:string,
    selectedImg:SelectedImgType,
    quantity:number,
    price:number

}
export type SelectedImgType={
    color:string,
    colorCode:string,
    image:string
}

const ProductDetails:React.FC<ProductDetailProps> = ({product}) => {
    // const productRating=product.reviews.reduce((acc:number,item:any)=>item.rating + acc,0)/product.reviews.length
  const {cartTotalQty,handleAddProductToCart,cartProducts}=useCart()
  const router=useRouter()
  const[isProductInCart,setIsProductInCart]=useState(false)
    const[cartProduct,setCartProduct]=useState<CartProductType>({
        id:product.id,
        name:product.name,
        description:product.description,
        category:product.category,
        brand:product.brand,
        quantity:1,
        selectedImg:{...product.images[0]},
        price:product.price
    })
    useEffect(()=>{
        setIsProductInCart(false)
        if(cartProducts){
            const existingIndex=cartProducts.findIndex((item)=>item.id===product.id)
       if(existingIndex>-1){
        setIsProductInCart(true)
       }
        }
    },[cartProducts])
    const handleColorSelect=useCallback((value:SelectedImgType)=>{
        setCartProduct((prev)=>{
            return {...prev,selectedImg:value}
        })
    },[cartProduct.selectedImg])
    const handleQtyDerease=useCallback(()=>{
        setCartProduct((prev)=>{
            return {...prev,quantity:--prev.quantity}
        })
    },[cartProduct])
    const handleQtyIncrease=useCallback(()=>{
        if(cartProduct.quantity===1){
            return;
        }
        setCartProduct((prev)=>{
            return {...prev,quantity:++prev.quantity}
        })
    },[cartProduct])
   return ( <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect} />
        <div className="flex flex-col gap-1 text-slate-500 text-sm">

            <h2 className="text-3xl font-medium text-slate-700">
                {product.name}
            </h2>
            <div className="flex items-center gap-2">
                <Rating value={5}/>
                <div>{product.reviews.length} reviews</div>
            </div>
            <Horizontal/>
            <div className="text-justify">{product.description}</div>
            <Horizontal/>
            <div>
                <span className="font-semibold">CATEGORY</span>
                {product.category}
            </div>
            <div>
                <span className="font-semibold">BRAND</span>
                {product.brand}
            </div>
            <div className={product.inStock?"text-slate-400":"text-rose-400"}>
                {product.inStock?"In Stock":"Out of Stock"}
            </div>
            <Horizontal/>
            {isProductInCart?<>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
                <MdCheckCircle className="text-slate-400" size={20}/>
                <span>Product added to Cart</span>

                </p>
                <div>
                    <Button label="View Cart" outline onClick={()=>{
                        router.push("/cart")
                    }} />

                    
                </div>
                </>:<>
                <SetColor cartProduct={cartProduct} images={product.images} handleColorSelect={handleColorSelect}/>
            <Horizontal/>
            <SetQuantity cartProduct={cartProduct} handleQtyDerease={handleQtyDerease} handleQtyIncrease={handleQtyIncrease}/>
           <Horizontal/>
           <div>
            <Button label="Add To Cart" onClick={()=>handleAddProductToCart(cartProduct)}/>
           </div>
            </>}
            
        </div>
    </div> );
}
 
export default ProductDetails;
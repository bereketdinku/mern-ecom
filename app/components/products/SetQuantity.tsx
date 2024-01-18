"use client"

import { CartProductType } from "@/app/product/[productId]/ProductDetils";

interface SetQtyProps{
    cartCounter?:boolean;
    cartProduct:CartProductType;
    handleQtyIncrease:()=>void;
    handleQtyDerease:()=>void;
}
const btnStyle="border-[1.2px] border-slate-300"
const SetQuantity:React.FC<SetQtyProps> = ({cartCounter,cartProduct,handleQtyDerease,handleQtyIncrease}) => {
    return ( <div className="flex gap-8 items-center">
        {cartCounter?null:<div className="font-semibold">QUANTITY</div>}
        <div className="flex gap-4 items-center text-base">
       <button className={btnStyle} onClick={handleQtyDerease}>-</button>
       <div>{cartProduct.quantity}</div>
       <button className={btnStyle} onClick={handleQtyIncrease}>+</button>
        </div>

    </div> );
}
 
export default SetQuantity;
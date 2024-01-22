import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetils";
import ListRating from "@/app/components/products/ListRating";
import getProductById from "@/actions/getProductByid";

interface IParams{
    productId:string
}
const Product = async({params}:{params:IParams}) => {
   const product=await getProductById(params)
   if(!product) return null
   return ( <div className="p-8">
        <Container>
            <ProductDetails product={product}/>
            <div className="flex flex-col mt-20 gap-4">
                <div>Add Rating </div>
                <ListRating product={product}/>
                <div>List</div>
            </div>
        </Container>
    </div> );
}
 
export default Product;
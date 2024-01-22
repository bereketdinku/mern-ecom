import { Container } from "@mui/material";
import FormWrap from "../components/FormWrap";
import LoginForm from "./LoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const SignIn = async() => {
    const currentUser=await getCurrentUser()
    return ( <Container>
        <FormWrap>
            <LoginForm currentUser={currentUser}/>
        </FormWrap>
    </Container> );
}
 
export default SignIn;
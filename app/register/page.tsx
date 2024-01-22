import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import SignUpForm from "./RegisterForm";

const SignUp =async () => {
    const currentUser=await getCurrentUser()
    return ( <Container>
        <FormWrap>
            <SignUpForm currentUser={currentUser}/>
        </FormWrap>
    </Container> );
}
 
export default SignUp;
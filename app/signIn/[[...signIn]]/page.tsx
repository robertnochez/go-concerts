import { SignIn } from "@clerk/nextjs";

export default function SignInComponent(){
    return (
        <div className="flex justify-center h-screen items-center">
           <SignIn /> 
        </div>  
        
    )
}


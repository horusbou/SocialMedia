import './signIn.css'
import { useState } from 'react';
import {Flex} from '@chakra-ui/react';
import SignIn from './SignIn'
import SignUp from './SignUp'

const LoginSignUp = () => {
    const [signUpComponent,setSignUpComponent]= useState(false);

	return (
		<div className='container'>
            <Flex
			flexDirection="row"
			justifyContent="space-around"
            alignContent={"center"}
		>
            <Flex width="40%"
             flexDirection="column"
             justifyContent="flex-start"
               className="leftside"
                >
                <header>
                    <h1>Alto.</h1>
                </header>
                <main>
                    <h3>Welcome to Alto !</h3>
                    <div className="description">
                        <p>Where sharing and gathering experience is made easy.</p>
                        <p>A platform dedicated to Ensa students and graduates to improve the experience of the.......  </p>
                    </div>
                </main>
                </Flex>
                {!signUpComponent?<SignIn setSignUpComponent={()=>setSignUpComponent(true)}/>:<SignUp setSignUpComponent={()=>setSignUpComponent(false)}/>}
            </Flex>
        </div>
	);
};

export default LoginSignUp;

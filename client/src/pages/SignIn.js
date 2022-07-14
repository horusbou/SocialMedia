import { useState } from 'react';
import client from '../services/Client';
import {colors} from '../lib'
import './signIn.css'
import {
	Flex,
    Icon,
	Button as ButtonCh,
	Input,
	InputGroup,
	Stack,
	FormControl,
	InputRightElement,
    FormErrorMessage
} from '@chakra-ui/react';
import {AiOutlineGoogle} from 'react-icons/ai'
import {BiHide,BiShow} from 'react-icons/bi'
import {Button} from '../compontents'
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

const SignIn = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [loginInProgress, setLoginInProgress] = useState(false);
    const [emailError,setEmailError]= useState(false);
    const [passwordError,setPasswordError]= useState(false);
    const [error,setError]= useState(false);
    const [errorText,setErrorText] = useState('');
	const handleShowClick = () => setShowPassword(!showPassword);

	const handleSubmit = (evt) => {
		evt.preventDefault();
        setLoginInProgress(true);
        if(emailError || passwordError){
            setLoginInProgress(false);
            return setError(true)
        }
		client.login({ email, password })
        .then(() => setShouldRedirect(true))
        .catch((err)=>{
            setErrorText(err.message)
            setError(true);
            setLoginInProgress(false);
        })
	};
	if (shouldRedirect) return <Redirect to="/home" />;
	return (

                <Flex
                flexDirection={"column"}
                justifyContent="center"
                alignContent="center"
                width="50%"
                backgroundColor={colors.white}
                className="rightside"
                >
                <Flex
                flexDirection={"row"}
                justifyContent="flex-end"
                >
                    <Button onClick={()=>{props.setSignUpComponent(true)}}>SignUp</Button>
                </Flex>
                <Flex flexDirection={"column"} className='loginPage'>
                    <div className="login">
                            <h1>Login</h1>
                    </div>
                    <Button isFull={true} important={false}>
                        <Icon as={AiOutlineGoogle} width="20px" height={"25px"} marginRight="10px"  />
                        <p>Sign In with Google</p>
                    </Button>
                    <div className='options'>
                        <p>Don't have an account?</p>
                        <p onClick={()=>{props.setSignUpComponent(true)}}>Create an account</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                    <Stack
                                spacing={10}
                            >
                                <FormControl isInvalid={error}>
                                    <InputGroup flexDirection={"column"} alignItems="flex-end">
                                        <Input
                                            style={{color:'black'}}
                                            _focus={{backgroundColor:'rgba(244,59,134,0.1)',borderColor:colors.pink,boxShadow:`0px 1px 0px 0px ${colors.pink}`}}
                                            _active={{color:'red',borderColor:'transparent',}}
                                            type="email"
                                            variant='flushed'
                                            placeholder="Email"
                                            onChange={(evt) => {
                                                setEmail(evt.target.value);
                                            }}
                                        />
                                         {emailError?<FormErrorMessage>{'Email is required.'}</FormErrorMessage>:error ?<FormErrorMessage>{errorText}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={error}>
                                    <InputGroup flexDirection={"column"} alignItems="flex-end">
                                        <Input

                                        style={{color:'black'}}
                                        colorScheme="red"
                                        _focus={{backgroundColor:'rgba(244,59,134,0.1)',borderColor:colors.pink,boxShadow:`0px 1px 0px 0px ${colors.pink}`}}
                                        _active={{border:'transparent'}}
                                        _autofill={{
                                            border:'transparent'
                                        }}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            variant='flushed'
                                            onChange={(evt) => {
                                                setPassword(evt.target.value);
                                            }}
                                            />
                                        <InputRightElement width="4.5rem">
                                            <ButtonCh _active={{}} _focus={{}} bg="" h="1.75rem" color={colors.pink} size="sm" onClick={handleShowClick}>
                                                {showPassword ? <Icon as={BiHide} /> : <Icon as={BiShow} />}
                                            </ButtonCh>
                                        </InputRightElement>
                                        {/* {emailError?<FormErrorMessage>{'Password is required.'}</FormErrorMessage>:error ?<FormErrorMessage>{errorText}</FormErrorMessage>:null} */}
                                        {emailError?<FormErrorMessage>{'Password is required.'}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <ButtonCh
								borderRadius={0}
								type="submit"
								variant="solid"
								colorScheme="teal"
								width="full"
								isDisabled={!email && !password}
								isLoading={loginInProgress}
                                backgroundColor="#F43B86"
                                _hover={{backgroundColor:'#F43B86'}}
                                _active={{backgroundColor:'#F43B86'}}
                                _focus={{border:'transparent'}}
                                onClick={()=>{
                                    if(!password.length)
                                        setPasswordError(true);
                                    if(!email.length)
                                        setEmailError(true);
                                }}
							>
								Login
							</ButtonCh>
                            <div className="forgetPassword">
                                <Link to="/repassword">forgot password?</Link>
                            </div>
                            </Stack>
                    </form>
                </Flex>
                </Flex>
	);
};

export default SignIn;

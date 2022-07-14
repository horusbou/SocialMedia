import { useState } from 'react';
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
import {BiHide,BiShow} from 'react-icons/bi'
import {Button} from '../compontents'
import Client from '../services/Client';

const SignUp = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	// const [shouldRedirect, setShouldRedirect] = useState(false);
	const [signUpInProgress, setSignUpInProgress] = useState(false);
	const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');

    const [emailError,setEmailError]= useState(false);
    const [usernameError,setUsernameError]= useState(false);
    const [firstNameError,setFirstNameError]= useState(false);
    const [lastNameError,setLastNameError]= useState(false);
    const [passwordError,setPasswordError]= useState(false);
    const [confirmedPasswordError,setConfirmedPasswordError]= useState(false);

    const [error,setError]= useState(false);
    const [emailErrorText,setEmailErrorText]= useState('');
    const [usernameErrorText,setUsernameErrorText]= useState('');
    const [firstNameErrorText,setFirstNameErrorText]= useState('');
    const [lastNameErrorText,setLastNameErrorText]= useState('');
    const [passwordErrorText,setPasswordErrorText]= useState('');
    const [confirmedPasswordErrorText,setConfirmedPasswordErrorText]= useState('');


	const handleShowClick = () => setShowPassword(!showPassword);
    const usernameRegex = /^[a-zA-Z0-9_]{5,10}$/;
    const nameRegex = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z]+(?<![_.])$/;
    const passwordRegex = /^[A-Za-z]\w{7,25}$/;

	const handleSubmit = async(evt) => {
        setError(!(email.length!==0 && password.length!==0 && firstName.length!==0 && lastName.length!==0 && confirmedPassword.length!==0 && username.length!==0))
		evt.preventDefault();
        setSignUpInProgress(true);
        if(!usernameRegex.test(username)){
            setSignUpInProgress(false);
            setError(true);
            setUsernameError(true);
            setUsernameErrorText('Username is 5-10 characters long')
        }else{
            setUsernameError(false);
            setUsernameErrorText('')
        }
        if(!nameRegex.test(firstName)){
            setSignUpInProgress(false);
            setError(true);
            setFirstNameError(true);
            setFirstNameErrorText('FirstName is 5-20 characters long')
        }else{
            setFirstNameError(false);
            setFirstNameErrorText('')
        }
        if(!nameRegex.test(lastName)){
            setSignUpInProgress(false);
            setError(true);
            setLastNameError(true);
            setLastNameErrorText('LastName is 5-20 characters long')
        }else{
            setLastNameError(false);
            setLastNameErrorText('')
        }
        if(!passwordRegex.test(password)){
            setSignUpInProgress(false);
            setError(true);
            setPasswordError(true);
            setPasswordErrorText('password is 7-25 characters long')
        }else{
            setPasswordError(false);
            setPasswordErrorText('')
        }
        if(password.length !== confirmedPassword.length){
            setSignUpInProgress(false);
            setError(true);
            setConfirmedPasswordError(true);
            setConfirmedPasswordErrorText('Passwords did not match')
        }else if (password === confirmedPassword){
            setConfirmedPasswordError(false);
            setConfirmedPasswordErrorText('')
        }
        Client.signUp({username,firstname:firstName,lastname:lastName,email,password,confirmedPassword})
        .then( (data)=>{
            setSignUpInProgress(false)
            setEmailError(false);
            setEmailErrorText('')
            setUsernameError(false);
            setUsernameErrorText('')
            setUsername('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmedPassword('')
            // setShouldRedirect(true)
        }).catch((error)=>{
            setSignUpInProgress(false)
            if(error.response){
                if(error?.response?.data?.options?.field === 'email'){
                    setEmailError(true);
                    setEmailErrorText(error.response.data.message)
                }
                if(error?.response?.data?.options?.field === 'username'){
                    setUsernameError(true);
                    setUsernameErrorText(error.response.data.message)
                }
            }
            console.log(error?.response.data)
        })
	};
	// if (shouldRedirect) return <Redirect to="/login" />;

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
                <Button onClick={()=>{props.setSignUpComponent()}}>Login</Button>

                </Flex>
                <Flex flexDirection={"column"} className='loginPage ' >
                    <div className="login">
                            <h1>Sign Up</h1>
                    </div>
                    <form onSubmit={handleSubmit} >
                    <Stack
                                spacing={5}
                            >
                                <FormControl isInvalid={usernameError}>
                                    <InputGroup flexDirection={"column"} alignItems="flex-end">
                                        <Input

                                            style={{color:'black'}}
                                            _focus={{backgroundColor:'rgba(244,59,134,0.1)',borderColor:colors.pink,boxShadow:`0px 1px 0px 0px ${colors.pink}`}}
                                            _active={{color:'red',borderColor:'transparent',}}
                                            type="text"
                                            variant='flushed'
                                            placeholder="Username"
                                            onChange={(evt) => {
                                                setUsername(evt.target.value);
                                                setUsernameError(false)
                                                setUsernameErrorText('')
                                                setError(false)
                                                }
                                            }
                                        />
                                         {usernameError
                                         ?<FormErrorMessage>{usernameErrorText || 'Username is required.' }</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={firstNameError}>
                                    <InputGroup flexDirection={"column"} alignItems="flex-end">
                                        <Input
                                            style={{color:'black'}}
                                            _focus={{backgroundColor:'rgba(244,59,134,0.1)',borderColor:colors.pink,boxShadow:`0px 1px 0px 0px ${colors.pink}`}}
                                            _active={{color:'red',borderColor:'transparent',}}
                                            type="text"
                                            variant='flushed'
                                            placeholder="First Name"
                                            onChange={(evt) => {
                                                setFirstName(evt.target.value);
                                                setFirstNameError(false)
                                                setFirstNameErrorText('')
                                                setError(false)

                                            }}
                                        />
                                         {firstNameError?<FormErrorMessage>{firstNameErrorText || 'FirstName is required.'}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={lastNameError}>
                                    <InputGroup flexDirection={"column"} alignItems="flex-end">
                                        <Input
                                            style={{color:'black'}}
                                            _focus={{backgroundColor:'rgba(244,59,134,0.1)',borderColor:colors.pink,boxShadow:`0px 1px 0px 0px ${colors.pink}`}}
                                            _active={{color:'red',borderColor:'transparent',}}
                                            type="text"
                                            variant='flushed'
                                            placeholder="Last Name"
                                            onChange={(evt) => {
                                                setLastName(evt.target.value);
                                                setLastNameError(false)
                                                setLastNameErrorText('')
                                                setError(false)

                                            }}
                                        />
                                         {lastNameError?<FormErrorMessage>{lastNameErrorText || 'LastName is required.'}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={emailError}>
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
                                                setEmailError(false)
                                                setEmailErrorText('')
                                                setError(false)

                                            }}
                                        />
                                         {emailError?<FormErrorMessage>{emailErrorText || 'Email is required.'}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={passwordError}>
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
                                                setPasswordError(false)
                                                setPasswordErrorText('')
                                                setError(false)

                                            }}
                                            />
                                        <InputRightElement width="4.5rem">
                                            <ButtonCh _active={{}} _focus={{}} bg="" h="1.75rem" color={colors.pink} size="sm" onClick={handleShowClick}>
                                                {showPassword ? <Icon as={BiHide} /> : <Icon as={BiShow} />}
                                            </ButtonCh>
                                        </InputRightElement>
                                        {/* {emailError?<FormErrorMessage>{'Password is required.'}</FormErrorMessage>:error ?<FormErrorMessage>{errorText}</FormErrorMessage>:null} */}
                                        {passwordError?<FormErrorMessage>{passwordErrorText || 'Password is required.'}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={confirmedPasswordError}>
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
                                            placeholder="Confirme Password"
                                            variant='flushed'
                                            onChange={(evt) => {
                                                setConfirmedPassword(evt.target.value);
                                                setConfirmedPasswordError(false)
                                                setConfirmedPasswordErrorText('')
                                                setError(false)

                                            }}
                                            />
                                        <InputRightElement width="4.5rem">
                                            <ButtonCh _active={{}} _focus={{}} bg="" h="1.75rem" color={colors.pink} size="sm" onClick={handleShowClick}>
                                                {showPassword ? <Icon as={BiHide} /> : <Icon as={BiShow} />}
                                            </ButtonCh>
                                        </InputRightElement>
                                        {confirmedPasswordError?<FormErrorMessage>{confirmedPasswordErrorText || 'Confirmed Password is required.'}</FormErrorMessage>:null}
                                    </InputGroup>
                                </FormControl>
                                <ButtonCh
								borderRadius={0}
								type="submit"
								variant="solid"
								colorScheme="teal"
								width="full"
								isDisabled={error}
                                //!(email.length!==0 && password.length!==0 && firstName.length!==0 && lastName.length!==0 && confirmedPassword.length!==0 && username.length!==0)
								isLoading={signUpInProgress}
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
                                Sign Up
							</ButtonCh>
                            </Stack>
                    </form>
                </Flex>
                </Flex>
	);
};

export default SignUp;

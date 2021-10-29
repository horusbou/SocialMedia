import { useState } from 'react';
import client from '../services/Client';
import {
	Flex,
	Heading,
	Input,
	Button,
	InputGroup,
	Stack,
	InputLeftElement,
	chakra,
	Box,
	Avatar,
	FormControl,
	FormHelperText,
	InputRightElement,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [loginInProgress, setLoginInProgress] = useState(false);

	const handleShowClick = () => setShowPassword(!showPassword);
	const handleSubmit = (evt) => {
		evt.preventDefault();
		setLoginInProgress(true);
		client.login({ email, password }).then((data) => setShouldRedirect(true));
	};
	if (shouldRedirect) return <Redirect to="/home" />;
	return (
		<Flex
			flexDirection="column"
			width="100%"
			height="100vh"
			backgroundColor="gray.200"
			justifyContent="center"
			alignItems="center"
		>
			<Stack
				flexDir="column"
				mb="2"
				justifyContent="center"
				alignItems="center"
			>
				<Avatar bg="teal.500" />
				<Heading color="teal.400">Welcome</Heading>
				<Box minW={{ base: '90%', md: '468px' }}>
					<form onSubmit={handleSubmit}>
						<Stack
							spacing={4}
							p="1rem"
							backgroundColor="whiteAlpha.900"
							boxShadow="md"
						>
							<FormControl>
								<InputGroup>
									<InputLeftElement
										pointerEvents="none"
										children={<CFaUserAlt color="gray.300" />}
									/>
									<Input
										type="email"
										placeholder="email address"
										onChange={(evt) => {
											setEmail(evt.target.value);
										}}
									/>
								</InputGroup>
							</FormControl>
							<FormControl>
								<InputGroup>
									<InputLeftElement
										pointerEvents="none"
										color="gray.300"
										children={<CFaLock color="gray.300" />}
									/>
									<Input
										type={showPassword ? 'text' : 'password'}
										placeholder="Password"
										onChange={(evt) => {
											setPassword(evt.target.value);
										}}
									/>
									<InputRightElement width="4.5rem">
										<Button h="1.75rem" size="sm" onClick={handleShowClick}>
											{showPassword ? 'Hide' : 'Show'}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormHelperText textAlign="right">
									<Link to="/repassword">forgot password?</Link>
								</FormHelperText>
							</FormControl>
							<Button
								borderRadius={0}
								type="submit"
								variant="solid"
								colorScheme="teal"
								width="full"
								isDisabled={!email && !password}
								isLoading={loginInProgress}
							>
								Login
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
			<Box>
				New to us?{' '}
				<Link to="/signup" color="teal.500" replace>
					Sign Up
				</Link>
			</Box>
		</Flex>
	);
};

export default SignIn;

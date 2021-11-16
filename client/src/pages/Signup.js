import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Flex,
	Text,
	Box,
	Input,
	InputGroup,
	InputRightElement,
	Button,
	Icon,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function SignupForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showRepassword, setShowRepassword] = useState(false);
	const handleClick = () => setShowPassword(!showPassword);
	const handleClickConfirm = () => setShowRepassword(!showRepassword);
	const formik = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			username: '',
			email: '',
			password: '',
			rePassword: '',
		},
		validationSchema: Yup.object({
			firstName: Yup.string()
				.max(10, 'Must be 10 characters or less')
				.required('Required'),
			lastName: Yup.string()
				.max(10, 'Must be 10 characters or less')
				.required('Required'),
			email: Yup.string().email('Invalid email address').required('Required'),
			password: Yup.string()
				.required('No password provided.')
				.min(8, 'Password is too short - should be 8 chars minimum.')
				.matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
			rePassword: Yup.string().oneOf(
				[Yup.ref('password'), null],
				'password must match'
			),
		}),
		onSubmit: (values) => console.log(values),
	});
	return (
		<Box
			w="100%"
			className="signup"
			bgGradient="linear(to-l, #7928CA, #FF0080)"
		>
			<form onSubmit={formik.handleSubmit}>
				<Box w="100%" boxShadow="base" className="titile">
					<Text color="white" align="center" fontSize="6xl">
						Sign Up
					</Text>
				</Box>

				<Flex
					direction="column"
					justify="space-between"
					bgColor="white"
					p="10"
					px="30"
					rounded="2xl"
					w="45%"
					h="450px"
					m="auto"
					mt="50px"
				>
					<Link to="/">
						<Flex align="center" mt={-15} h={8} ml={-4}>
							<Icon as={ChevronLeftIcon} w={8} h={8} />
							Home
						</Flex>
					</Link>
					<Flex justify="space-between" align="center">
						<Box>
							<Input
								id="firstName"
								name="firstName"
								placeholder="First Name"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.firstName}
								isInvalid={formik.touched.firstName && formik.errors.firstName}
							/>
						</Box>
						<Box>
							<Input
								id="lastName"
								name="lastName"
								placeholder="Last Name"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.lastName}
								isInvalid={formik.touched.lastName && formik.errors.lastName}
							/>
						</Box>
					</Flex>
					<Box>
						<Input
							id="email"
							name="email"
							placeholder="Email"
							type="email"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							isInvalid={formik.touched.email && formik.errors.email}
						/>
					</Box>
					{/* <Box>
						<Input
							placeholder="Username"
							type="text"
							// onChange={(evt) => setUsername(evt.target.value)}
						/>
					</Box> */}
					<InputGroup size="md">
						<Input
							id="password"
							name="password"
							pr="4.5rem"
							type={showPassword ? 'text' : 'password'}
							placeholder="Enter Password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
							isInvalid={formik.touched.password && formik.errors.password}
						/>
						<InputRightElement width="4.5rem">
							<Button h="1.75rem" size="sm" onClick={handleClick}>
								{showPassword ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					</InputGroup>
					<InputGroup size="md">
						<Input
							id="rePassword"
							name="rePassword"
							pr="4.5rem"
							type={showRepassword ? 'text' : 'password'}
							placeholder="Confirme Password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.rePassword}
							isInvalid={formik.touched.rePassword && formik.errors.rePassword}
						/>
						<InputRightElement width="4.5rem">
							<Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
								{showRepassword ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					</InputGroup>
					<Button type="submit">Sign up</Button>
				</Flex>
			</form>
		</Box>
	);
}

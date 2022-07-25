import React from 'react';
import { Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { colors } from '../../lib';

export const MoreOption=({ Icon, children })=> {
	return (
		<Menu>
			<MenuButton>{Icon}</MenuButton>
			<MenuList style={{color:'white'}} backgroundColor={colors.background}>{children}</MenuList>
		</Menu>
	);
}

import React from 'react';
import { Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { colors } from '../../lib';

export const MoreOption=({ Icon, children })=> {
	return (
		<Menu className="menu" >
			<MenuButton>{Icon}</MenuButton>
			<MenuList backgroundColor={colors.background}>{children}</MenuList>
		</Menu>
	);
}

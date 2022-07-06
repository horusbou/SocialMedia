import React from 'react';
import { Menu, MenuButton, MenuList } from '@chakra-ui/react';
export const MoreOption=({ Icon, children })=> {
	return (
		<Menu>
			<MenuButton>{Icon}</MenuButton>
			<MenuList>{children}</MenuList>
		</Menu>
	);
}

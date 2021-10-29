import React, { useState } from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Spinner, Center } from '@chakra-ui/react';
import './gif.css';
import { Input, Box, CloseButton } from '@chakra-ui/react';

const gf = new GiphyFetch('rBVFbx7Xp0FAYvDrXuSJaAdofMXJpIwt');

export default function Gif(props) {
	const [searchItem, setSearchItem] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (evt) => {
		return setSearchItem(evt.target.value);
	};
	const handleClose = () => {
		setSearchItem('');
		props.handleClose();
	};
	const fetchGifs = (offset) => {
		setLoading(true);
		return gf.search(searchItem, { offset, limit: 10 }).then((fetched) => {
			setLoading(false);
			return fetched;
		});
	};
	const trendingFetchGifs = (offset) => {
		setLoading(true);
		return gf.trending({ offset, limit: 10 }).then((fetched) => {
			setLoading(false);
			return fetched;
		});
	};
	return (
		<Box boxShadow="dark-lg" className="gif-controller">
			<CloseButton
				className="closeButton"
				size="sm"
				onClick={handleClose}
				borderRadius="50%"
				backgroundColor="#25221e"
				color="white"
				_hover={{ opacity: 0.6 }}
			/>
			<div className="gif-content">
				<div className="search-bar">
					<Input
						placeholder="Search for a gif"
						value={searchItem}
						onChange={handleChange}
						color="black"
					/>
				</div>
				{loading ? (
					<Center w="100%" h="200px">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
					</Center>
				) : null}
				{!!searchItem ? (
					<Grid
						noLink={true}
						onGifClick={(item) => {
							props.handleSelectedGif(item.images.original.url);
							handleClose();
						}}
						width={370}
						columns={2}
						fetchGifs={fetchGifs}
						key={searchItem}
					/>
				) : (
					<Grid
						noLink={true}
						onGifClick={(item) => {
							props.handleSelectedGif(item.images.original.url);
							handleClose();
						}}
						width={370}
						columns={2}
						fetchGifs={trendingFetchGifs}
						key={searchItem}
					/>
				)}
			</div>
		</Box>
	);
}

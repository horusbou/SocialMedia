import { Spinner } from '@chakra-ui/react'
import './index.css'
import { colors } from '../../lib'

export const LoadingSpinner = ()=>{
    return (<div className='spinner-container'>
        <Spinner
            thickness='2px'
            speed='0.65s'
            emptyColor={colors.white}
            color={colors.pink}
            size='md'
/>
    </div>)
}

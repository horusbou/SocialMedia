import {Flex} from '@chakra-ui/react'
import './index.css'
export const Button =({isFull,colored,important=true,children})=>{
let className="button-container";
if(isFull)
className+=' full';
if(colored)
className+=' colored';
if(important)
className+=' important';



return (<div className={className} >
              <div>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <Flex className={colored?'children':'children'} justifyContent={"center"} >{children}</Flex>
                </div>
    </div>)
}

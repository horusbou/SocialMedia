import {Input,InputGroup,InputLeftElement} from "@chakra-ui/react"
import {Search2Icon} from "@chakra-ui/icons"
import {colors} from "../../lib"
import './index.css'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    useBoolean
  } from '@chakra-ui/react'
import useFetchUsers from "../../hooks/useFetchUsers";
import ContactItem from '../Followers/contactItem'
import {LoadingSpinner} from '../Spinner'


export function SearchBar(){

    const [isEditing, setIsEditing] = useBoolean()
    const { loading ,data, setData } = useFetchUsers();
    let paddingButtom = data.results.length===0 && '20px';
return (<div className="searchBar">
                <Popover autoFocus={false} isOpen={isEditing} onOpen={setIsEditing.on}>
                    <PopoverTrigger>
                        <InputGroup>
                            <InputLeftElement children={<Search2Icon color='RGBA(255, 255, 255, 0.5)'/>} />
                            <Input
                            _focus={{}}
                            _active={{}}
                            style={{border:'solid 2px RGBA(255, 255, 255, 0.08)', backgroundColor:colors.background , borderRadius:'40px'}}
                            placeholder="Search Alto"
                            _placeholder={{ color: 'RGBA(255, 255, 255, 0.5)' }}
                            color={"white"}
                            value={data.slug}
                            onFocus={()=>{setIsEditing.on()}}
                            onChange={(e)=>setData({ ...data, slug: e.target.value })}
                            onBlur={()=>{setIsEditing.off();setData({ slug: '',results:[] })}}
                            />
                        </InputGroup>
                    </PopoverTrigger>

                <PopoverContent _focus={{}}  backgroundColor={colors.background} pb={paddingButtom} >
                    <PopoverArrow />
                    {!data.slug && <PopoverHeader style={{fontSize:'13px', textAlign:'center',color: 'RGBA(255, 255, 255, 0.5)' ,border:'none'}}>Try searching for people, topics, or keywords</PopoverHeader>}
                    <PopoverBody>
                        {loading&&<LoadingSpinner />}
                        {data.results.map((el)=><ContactItem key={el.user_id} username={el.username} firstName={el.firstname} lastName={el.lastname} userAvatar={el.userAvatar} />)}
                    </PopoverBody>
                </PopoverContent>
                </Popover>
            </div>)
}

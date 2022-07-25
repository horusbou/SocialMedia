import './index.css'
import {userContext} from '../'
import { useContext } from 'react'

export function PopOver(){
    const user = useContext(userContext)
    return (<div>{user&&`Log out @{user.username}`}</div>)
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@chakra-ui/react';
import './index.css'
export const PageTitle = ({title,to='',icon})=>{
    return (<div className="pageTitle">
        <Link to={to}>{(icon)?<Icon className='icon' as={icon} />:null}</Link>
        {title}
      </div>)
}

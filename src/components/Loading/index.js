import React from 'react'
import { CircularProgress } from '@material-ui/core';

export default function Loading() {
    return (
        <div style={{ display: 'flex', flex: 1, marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress color="#042963" size={50}/> 
        </div>
    )
}
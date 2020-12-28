import React from 'react'
import Spinner from "react-activity/lib/Spinner";

export default function Loading() {
    return (
        <div style={{ display: 'flex', flex: 1, marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Spinner color="#042963" size={50} speed={0.5} animating={true} />    
        </div>
    )
}
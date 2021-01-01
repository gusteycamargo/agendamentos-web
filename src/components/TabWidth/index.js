import React from 'react';

const TabWidth = ({ children }) => (
    <div style={{ width: '100%', overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
        {children}
    </div>
)

export default TabWidth
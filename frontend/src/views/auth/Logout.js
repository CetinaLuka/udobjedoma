import React, { useEffect } from 'react';
import auth from './auth';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        auth.clearToken();
        auth.clearUserInfo();
        navigate("/login");
    });

    return (
        <p>odjava...</p>
    );
}

export default Logout;

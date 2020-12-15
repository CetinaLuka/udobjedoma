import LoginView from './LoginView';
import React, { Component }  from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginWrapper() {
  const navigate = useNavigate();
  return <LoginView navigate={navigate}/>;
}
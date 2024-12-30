import React from 'react'
import { useNavigate } from 'react-router-dom';

export let RSAglobalNavigate = "";

export const GlobalNavigate = () => {
    RSAglobalNavigate = useNavigate();
    return null;
}


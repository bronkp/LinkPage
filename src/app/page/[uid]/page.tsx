"use client";
import { useParams, } from 'next/navigation';
import AuthContextProvider from '../../../../context/AuthContext';
import { useAuthContext } from '../../../../context/AuthContext';
import Tree from '../../../../components/Tree';
import Navbar from '../../../../components/Navbar';
import useState from 'react';
import { ColorPallet } from '../../../../types/types';


export default function Home() {
    const params = useParams()
  const { uid } = params;
  return (<>
  <AuthContextProvider>

    <Tree />

  </AuthContextProvider>
  </>);
}

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Link, Routes, Route, BrowserRouter } from 'react-router-dom';
import BalanceSheet from './pages/BalanceSheet';

function App() {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<BalanceSheet />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;

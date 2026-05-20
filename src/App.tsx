import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LeaveGuide from './components/LeaveGuide';
import LeaveCalculator from './components/LeaveCalculator';
import DiscussionBoard from './components/DiscussionBoard';
import Analysis from './components/Analysis';
import FAQ from './components/FAQ';
import Contact from './components/Contact';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LeaveGuide />} />
          <Route path="calculator" element={<LeaveCalculator />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="discussion" element={<DiscussionBoard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

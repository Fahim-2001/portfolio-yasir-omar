import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Hero } from './sections/Hero';

// Below-the-fold sections lazy-loaded to isolate chunks and maximize initial render speed
const About = lazy(() => import('./sections/About'));
const Experience = lazy(() => import('./sections/Experience'));
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Achievements = lazy(() => import('./sections/Achievements'));
const Education = lazy(() => import('./sections/Education'));
const Contact = lazy(() => import('./sections/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function SectionPlaceholder({ minHeight = 'min-h-[350px]' }) {
  return (
    <div
      className={`w-full ${minHeight} flex items-center justify-center`}
      aria-hidden="true"
    />
  );
}

function HomePage() {
  return (
    <Layout>
      {/* Above-the-fold Hero is eagerly loaded */}
      <Hero />

      {/* Below-the-fold sections are lazy-loaded */}
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[400px]" />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[500px]" />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[700px]" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[600px]" />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[450px]" />}>
        <Achievements />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[450px]" />}>
        <Education />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder minHeight="min-h-[450px]" />}>
        <Contact />
      </Suspense>
    </Layout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<SectionPlaceholder minHeight="min-h-screen" />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

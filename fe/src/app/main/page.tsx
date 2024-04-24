// src/app/main/page.tsx
import React from 'react';
import UrlInput from '@/components/Analyzer/UrlInput'; // 상대 경로를 사용하여 불러옵니다.
import MyRepo from '@/components/RepoCard/MyRepo';

const MainPage = () => {
    return (
        <main>
            <h1>MainPage</h1>
            <UrlInput />
            <MyRepo userID='songjung-good' />
        </main>
    );
};

export default MainPage;

// src/app/main/page.tsx
import React from 'react';
import UrlInput from '@/components/repoanalysis/UrlInput'; // 상대 경로를 사용하여 불러옵니다.

const MainPage = () => {
    return (
        <main>
            <h1>MainPage</h1>
            <UrlInput />
        </main>
    );
};

export default MainPage;

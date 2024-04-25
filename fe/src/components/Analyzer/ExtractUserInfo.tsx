import React from 'react';

export const ExtractUserInfo = (url: string) => {
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);

  if (match) {
    return { username: match[1], repositoryName: match[2] };
  } else {
    return { username: null, repositoryName: null };
  }
};
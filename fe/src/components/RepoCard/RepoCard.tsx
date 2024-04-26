import React from 'react';
import styled from 'styled-components';


const RepoCard = () => {
  return (
    <Card>
      <h1>RepoCard</h1>
    </Card>
  )
}

const Card = styled.div`
  width: 300px;
  height: 300px;
  background-color: red;
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`

export default RepoCard;
// Contributions.tsx

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ApiResponse,
  Contribution,
  getContributions,
} from "@/api/userPage/apiContributions";

const ContributionsComponent = () => {
  // github에서 contributions(잔디) 가져오기
  const [contributions, setContributions] = useState<Contribution[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getContributions();
      setContributions(data.contributions);
    };

    fetchData();
  }, []);

  return (
    <>
      <ul>
        {contributions.map((contribution) => (
          <li key={contribution.date}>
            count: {contribution.count}, level: {contribution.level}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ContributionsComponent;

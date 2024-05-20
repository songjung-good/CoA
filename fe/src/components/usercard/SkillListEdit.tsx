import { Dispatch, SetStateAction, useState } from "react";
import { colorMapping } from "../colorMap";
import SmallCloseIcon from "@/icons/SmallCloseIcon";

interface Skill {
  codeId: number;
  codeName: string;
}

const SkillListEdit = ({
  skillIdList,
  setSkillIdList,
}: {
  skillIdList: Skill[];
  setSkillIdList: Dispatch<SetStateAction<Skill[]>>;
  // removeSkill: (skillIdToRemove: number) => void;
}) => {
  const [draggedItem, setDraggedItem] = useState<Skill | null>(null);
  // const [skillIdList, setSkillIdList] = useState<Skill[]>(skillIdList);

  const handleDragStart = (
    event: React.DragEvent<HTMLLIElement>,
    skill: Skill,
  ) => {
    setDraggedItem(skill);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLLIElement>,
    index: number,
  ) => {
    event.preventDefault();
    const draggedOverItem = skillIdList[index];
    if (!draggedItem) {
      // draggedItem이 null인 경우 함수 종료
      return;
    }
    if (draggedItem === draggedOverItem) {
      return;
    }

    const items = skillIdList.filter((item) => item !== draggedItem);
    items.splice(index, 0, draggedItem);

    setSkillIdList(items);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleRemoveSkill = (codeId: number) => {
    const updatedSkillIdList = skillIdList.filter(
      (skill) => skill.codeId !== codeId,
    );
    setSkillIdList(updatedSkillIdList);
    removeSkill(codeId);
  };
  const removeSkill = (skillIdToRemove: number) => {
    // skillIdToRemove와 일치하지 않는 스킬만 필터링하여 새로운 배열을 만듭니다.
    const updatedSkillList = skillIdList.filter(
      (skill) => skill.codeId !== skillIdToRemove,
    );
    // 새로운 배열을 skillIdList에 반영합니다.
    setSkillIdList(updatedSkillList);
  };
  return (
    <ul className="flex flex-wrap gap-2 p-1">
      {skillIdList.map((skill, index) => (
        <li
          key={skill.codeId}
          draggable
          onDragStart={(event) => handleDragStart(event, skill)}
          onDragOver={(event) => handleDragOver(event, index)}
          onDragEnd={handleDragEnd}
          style={{
            opacity: draggedItem === skill ? 0.5 : 1,

            padding: "4px",
            borderRadius: "9999px",
            backgroundColor: `${colorMapping[skill.codeName]}`,
          }}
        >
          <p className="flex text-white px-1 gap-1 items-center">
            {skill.codeName}
            <button onClick={() => handleRemoveSkill(skill.codeId)}>
              <SmallCloseIcon />
            </button>
          </p>
        </li>
      ))}
    </ul>
  );
};

export default SkillListEdit;

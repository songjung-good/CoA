import StartIcon from "@/app/_icons/StarIcon";
import StartIconFilled from "@/app/_icons/StarIconFilled";

interface IsStarProps {
  isStar: boolean;
}

export default function IsStar({
  isStar,
}: IsStarProps) {
  return isStar ? (
    <StartIconFilled />
  ) : (
    <StartIcon />
  );
}

import React from "react";
import DeleteIcon from "@/icons/DeleteIcon";

interface CommentItemProps {
  commentTargetString: string;
  commentContent: string;
  deleteComment: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  commentTargetString,
  commentContent,
  deleteComment,
}) => {
  return (
    <div className="w-full shadow-lg rounded-xl p-4 mb-4 hover:border-appBlue1 hover:border-2">
      <div className="flex justify-between items-center">
        <div className="text-2xl mb-2">{commentTargetString}</div>
        <div className="hover:text-red-600" onClick={deleteComment}>
          <DeleteIcon width={20} height={20} />
        </div>
      </div>
      <div className="text-base text-wrap">코멘트: {commentContent}</div>
    </div>
  );
};

export default CommentItem;

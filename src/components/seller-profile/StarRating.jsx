import Image from "next/image";
import StarFillIcon from "../../../public/image/StarFillIcon.svg";
import StarEmptyIcon from "../../../public/image/StarEmptyIcon.svg";

export default function StarRating({ rating, maxStars = 5 }) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <Image
            key={index}
            src={starValue <= rating ? StarFillIcon : StarEmptyIcon}
            alt={starValue <= rating ? "Filled star" : "Empty star"}
            width={20}
            height={20}
          />
        );
      })}
    </div>
  );
}

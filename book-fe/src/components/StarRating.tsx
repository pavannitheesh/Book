import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, editable = true }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editable && onRatingChange(star)}
          className={`text-2xl ${editable ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!editable}
        >
          <span
            className={`${star <= rating ? 'text-yellow-500' : 'text-gray-300'}
              transition-colors duration-200 hover:text-yellow-500`}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
import { Star } from "lucide-react";

/**
 * StarRating — Displays a 5-star rating with half-star support.
 * Previously duplicated in SupplierDashboard and ReceiverDashboard.
 */
interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i - 0.5 < rating;
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              filled
                ? "text-amber-400 fill-amber-400"
                : half
                ? "text-amber-400 fill-amber-400/40"
                : "text-gray-200"
            }`}
          />
        );
      })}
      <span className="text-gray-500 text-xs ml-1.5 tabular-nums">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

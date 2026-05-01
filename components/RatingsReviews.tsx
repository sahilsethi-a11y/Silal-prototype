import { StarIcon, VerifiedIcon } from "@/components/Icons";

export type ReviewItem = {
    id: string;
    author: string;
    role?: string;
    rating: number;
    title: string;
    body: string;
    date: string;
    verified?: boolean;
};

type Props = Readonly<{
    title: string;
    subtitle?: string;
    rating: number;
    reviewCount: number;
    reviews: ReviewItem[];
    distribution?: number[];
}>;

const clampRating = (rating: number) => Math.max(0, Math.min(5, rating));

const RatingStars = ({ rating }: Readonly<{ rating: number }>) => {
    const safeRating = clampRating(rating);

    return (
        <div className="flex items-center gap-0.5" aria-label={`${safeRating.toFixed(1)} out of 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                    key={index}
                    filled={index < Math.round(safeRating)}
                    className={`h-4 w-4 ${index < Math.round(safeRating) ? "text-amber-500" : "text-gray-300"}`}
                />
            ))}
        </div>
    );
};

export default function RatingsReviews({ title, subtitle, rating, reviewCount, reviews, distribution = [78, 16, 4, 1, 1] }: Props) {
    const safeRating = clampRating(rating);

    return (
        <section className="bg-white rounded-lg border border-stroke-light p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-brand-blue">{title}</h2>
                    {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-brand-blue">{safeRating.toFixed(1)}</div>
                    <div>
                        <RatingStars rating={safeRating} />
                        <div className="mt-1 text-xs text-gray-500">{reviewCount.toLocaleString()} reviews</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="space-y-2">
                    {distribution.map((value, index) => {
                        const stars = 5 - index;
                        return (
                            <div key={stars} className="grid grid-cols-[38px_1fr_38px] items-center gap-2 text-xs text-gray-600">
                                <span>{stars} star</span>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
                                </div>
                                <span className="text-right">{value}%</span>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-3">
                    {reviews.map((review) => (
                        <article key={review.id} className="rounded-lg border border-stroke-light bg-white p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-semibold text-gray-950">{review.author}</div>
                                    {review.role ? <div className="text-xs text-gray-500">{review.role}</div> : null}
                                </div>
                                <div className="text-right">
                                    <RatingStars rating={review.rating} />
                                    <div className="mt-1 text-xs text-gray-500">{review.date}</div>
                                </div>
                            </div>
                            <h3 className="mt-3 text-sm font-semibold text-brand-blue">{review.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{review.body}</p>
                            {review.verified ? (
                                <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                    <VerifiedIcon className="h-3.5 w-3.5" />
                                    Verified purchase
                                </div>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { useState } from "react";
import { Star, User, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface ProductReviewsProps {
  productId: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  userId: string;
  verified: boolean;
  createdAt: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews", productId],
  });

  const submitReview = useMutation({
    mutationFn: (reviewData: any) => fetch(`/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", productId] });
      setShowReviewForm(false);
      setRating(0);
      setTitle("");
      setComment("");
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
    },
  });

  const handleSubmitReview = () => {
    const sessionId = localStorage.getItem("zenthra-session-id") || 
      Math.random().toString(36).substr(2, 9);
    
    submitReview.mutate({
      productId,
      userId: sessionId,
      rating,
      title,
      comment,
    });
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const averageRating = reviewsArray.length > 0 
    ? reviewsArray.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviewsArray.length 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} out of 5 ({reviewsArray.length} reviews)
            </span>
          </div>
        </div>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Write Review
        </Button>
      </div>

      <Separator />

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold">Write a Review</h4>
            
            <div>
              <Label>Rating</Label>
              {renderStars(rating, true, setRating)}
            </div>

            <div>
              <Label htmlFor="review-title">Title</Label>
              <Input
                id="review-title"
                placeholder="Summary of your review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="review-comment">Review</Label>
              <Textarea
                id="review-comment"
                placeholder="Share your thoughts about this product"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={!rating || !title || !comment || submitReview.isPending}
              >
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsArray.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-semibold mb-2">No reviews yet</h4>
              <p className="text-muted-foreground">Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviewsArray.map((review: Review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Customer</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>
                
                <h5 className="font-semibold mb-2">{review.title}</h5>
                <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    Helpful
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
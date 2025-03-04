import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Review, InsertReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertReviewSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isWritingReview, setIsWritingReview] = useState(false);

  const { data: reviews } = useQuery<(Review & { userName: string })[]>({
    queryKey: [`/api/products/${productId}/reviews`],
  });

  const form = useForm<InsertReview>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      productId,
      rating: 5,
      comment: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (review: InsertReview) => {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!response.ok) throw new Error("Failed to submit review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setIsWritingReview(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: InsertReview) {
    if (!user) {
      toast({
        title: "Please login",
        description: "You must be logged in to submit a review.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate({ ...values, userId: user.id });
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {user && !isWritingReview && (
          <Button onClick={() => setIsWritingReview(true)}>Write a Review</Button>
        )}
      </div>

      {isWritingReview && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`p-0 ${
                              field.value >= rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => field.onChange(rating)}
                          >
                            <StarIcon className="h-6 w-6 fill-current" />
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your review here..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsWritingReview(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createReviewMutation.isPending}>
                    Submit Review
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    } fill-current`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium mb-1">{review.userName}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
        {!reviews?.length && (
          <p className="text-center text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
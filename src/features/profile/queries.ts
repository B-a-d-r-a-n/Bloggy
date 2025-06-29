import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../../core/services/userService";
import toast from "react-hot-toast";
import { authKeys } from "../auth/queries";
import type { User } from "../../core/types/user";

export const userKeys = {
  all: ["users"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
  comments: (userId: string) => [...userKeys.all, "comments", userId] as const,
  starred: (userId: string) => [...userKeys.all, "starred", userId] as const,
};

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    select: (data) => data.data.user,
  });
};
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      userService.updateProfilePicture(formData),
    onSuccess: (response) => {
      const updatedUser = response.data.user;
      queryClient.setQueryData(authKeys.me, updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser._id),
      });
      toast.success("Profile picture updated!");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: Partial<User>) => userService.updateUser(userData),
    onSuccess: (response) => {
      const updatedUser = response.data.user;
      queryClient.setQueryData(authKeys.me, updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser._id),
      });
      toast.success("Profile updated!");
    },
  });
};

export const useGetUserComments = (userId: string) => {
  return useQuery({
    queryKey: userKeys.comments(userId),
    queryFn: () => userService.getUserComments(userId),
    enabled: !!userId,
    select: (data) => data.data,
  });
};

export const useGetStarredArticles = (userId: string) => {
  return useQuery({
    queryKey: userKeys.starred(userId),
    queryFn: () => userService.getStarredArticles(userId),
    enabled: !!userId,
    select: (data) => data.data,
  });
};

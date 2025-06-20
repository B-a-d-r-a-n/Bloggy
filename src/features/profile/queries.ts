import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../../core/services/userService";
import toast from "react-hot-toast";
import { authKeys } from "../auth/queries";
export const userKeys = {
  all: ["users"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
};
export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    select: (data) => data.data.user,
  });
};
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => userService.updateAvatar(formData),
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
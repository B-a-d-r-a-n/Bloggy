import { useRef, useState, type ChangeEvent } from "react";
import { useUpdateProfilePicture, useUpdateUser } from "../queries";
import { getUserAvatar } from "../../../lib/utils";
import {
  CameraIcon,
  StarIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import type { User } from "../../../core/types/user";

interface ProfileDisplayProps {
  user: User;
  isOwnProfile: boolean;
}

export default function ProfileDisplay({
  user,
  isOwnProfile,
}: ProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address || "");
  const updateAvatarMutation = useUpdateProfilePicture();
  const updateUserMutation = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    updateAvatarMutation.mutate(formData);
  };

  const handleSave = () => {
    updateUserMutation.mutate({ name, address });
    setIsEditing(false);
  };

  return (
    <div className="bg-base-200 p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8">
      {/* Avatar Section */}
      <div className="avatar relative group">
        <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
          <img src={getUserAvatar(user.name, user.avatarUrl)} alt={user.name} />
        </div>
        {isOwnProfile && (
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 cursor-pointer bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {updateAvatarMutation.isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <CameraIcon className="w-8 h-8" />
            )}
          </label>
        )}
      </div>
      {isOwnProfile && (
        <input
          id="avatar-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          className="hidden"
          accept="image/*"
        />
      )}

      {/* User Info Section */}
      <div className="text-center md:text-left flex-grow">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="input input-bordered w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-base-content">
              {user.name}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
              {/* --- Email Row --- */}
              <div className="sm:col-span-1">
                <dt className="font-semibold text-base-content/70">Email</dt>
              </div>
              <div className="sm:col-span-5">
                <dd className="text-base-content">{user.email}</dd>
              </div>

              {/* --- Address Row --- */}
              {address && (
                <>
                  <div className="sm:col-span-1">
                    <dt className="font-semibold text-base-content/70">
                      Address
                    </dt>
                  </div>
                  <div className="sm:col-span-5">
                    <dd className="text-base-content">{user.address}</dd>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* --- TOTAL STARS DISPLAY --- */}
        <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-lg">
          <div
            className="flex items-center gap-2"
            title="Total stars received on all articles"
          >
            <StarIcon className="w-6 h-6 text-warning" />
            <span className="font-bold text-base-content">
              {user.totalStars}
            </span>
            <span className="text-base-content/60 text-sm">Total Stars</span>
          </div>
        </div>
      </div>

      {/* Edit/Save Buttons */}
      {isOwnProfile && (
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                <CheckIcon className="w-4 h-4" /> Save
              </button>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setIsEditing(false)}
              >
                <XMarkIcon className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="w-4 h-4" /> Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

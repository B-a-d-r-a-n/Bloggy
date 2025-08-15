import { Link } from "@tanstack/react-router";
import {
  NewspaperIcon,
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useGetUserProfile } from "../queries";
import { useCurrentUser } from "../../auth/queries";

interface ProfileNavProps {
  userId: string;
}

export default function ProfileNav({ userId }: ProfileNavProps) {
  const getActiveProps = () => ({
    className:
      "tab-active [--tab-bg:hsl(var(--p))] [--tab-color:hsl(var(--pc))]",
  });
  const { data: currentUser } = useCurrentUser();
  const { data: profileUser } = useGetUserProfile(userId);

  const isOwnProfile = currentUser?._id === profileUser?._id;
  
  return (
    <div
      role="tablist"
      className="tabs tabs-boxed bg-base-200 py-10 md:py-3.5 rounded-lg shadow-md"
    >
      <Link
        to="/profile/$userId"
        params={{ userId }}
        className="tab tab-lg flex-1 gap-2"
        activeProps={getActiveProps}
        activeOptions={{ exact: true }}
      >
        <NewspaperIcon className="w-6 h-6" />
        <span className="hidden sm:block">
          {isOwnProfile ? "My articles" : `${profileUser?.name}'s articles`}
        </span>
      </Link>
      <Link
        to="/profile/$userId/comments"
        params={{ userId }}
        className="tab tab-lg flex-1 gap-2"
        activeProps={getActiveProps}
      >
        <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
        <span className="hidden sm:block">
          {isOwnProfile ? "My comments" : `${profileUser?.name}'s comments`}
        </span>
      </Link>
      <Link
        to="/profile/$userId/starred"
        params={{ userId }}
        className="tab tab-lg flex-1 gap-2"
        activeProps={getActiveProps}
      >
        <StarIcon className="w-6 h-6" />
        <span className="hidden sm:block">
          {isOwnProfile ? "My stars" : `${profileUser?.name}'s stars`}
        </span>
      </Link>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import {
  NewspaperIcon,
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface ProfileNavProps {
  userId: string;
}

export default function ProfileNav({ userId }: ProfileNavProps) {
  const getActiveProps = () => ({
    className:
      "tab-active [--tab-bg:hsl(var(--p))] [--tab-color:hsl(var(--pc))]",
  });

  return (
    <div
      role="tablist"
      className="tabs tabs-boxed bg-base-200 py-3.5 rounded-lg shadow-md"
    >
      <Link
        to="/profile/$userId"
        params={{ userId }}
        className="tab tab-lg flex-1 gap-2"
        activeProps={getActiveProps}
        activeOptions={{ exact: true }}
      >
        <NewspaperIcon className="w-6 h-6" />
        My Articles
      </Link>
      <Link
        to="/profile/$userId/comments"
        params={{ userId }}
        className="tab tab-lg flex-1 gap-2"
        activeProps={getActiveProps}
      >
        <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
        My Comments
      </Link>
      <Link
        to="/profile/$userId/starred"
        params={{ userId }}
        className="tab tab-lg flex-1 gap-2"
        activeProps={getActiveProps}
      >
        <StarIcon className="w-6 h-6" />
        My Starred
      </Link>
    </div>
  );
}

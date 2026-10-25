"use client";

import { Mail, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { User } from "../types/user";
import { BranchId } from "@/features/branches/types/branch";

import UserDropdownActionButton from "./UserDropdownActionButton";

const colors = [
  "bg-rose-100 border-rose-200 text-rose-700",
  "bg-orange-100 border-orange-200 text-orange-700",
  "bg-amber-100 border-amber-200 text-amber-700",
  "bg-emerald-100 border-emerald-200 text-emerald-700",
  "bg-teal-100 border-teal-200 text-teal-700",
  "bg-sky-100 border-sky-200 text-sky-700",
  "bg-indigo-100 border-indigo-200 text-indigo-700",
  "bg-violet-100 border-violet-200 text-violet-700",
];

const UsersCard = ({
  user,
  isMe,
  branchId,
}: {
  user: User;
  isMe: boolean;
  branchId: BranchId;
}) => {
  const t = useTranslations("UsersPage.card");
  const initials = `${user.name.charAt(0)}${user.last_name.charAt(0)}`;

  const index =
    user.name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center gap-4 min-w-3/10">
        {
            !user.foto_url ? (
                <div
                    className={`${colors[index]} flex size-12 items-center justify-center rounded-full border`}
                >
                    <p>{initials}</p>
                </div>
            ) : (
                <div className="size-12">
                    <img
                        className="w-full h-full object-cover origin-center rounded-full border border-neutral-200 shadow"
                        src={user.foto_url}
                        alt={user.name} />
                </div>
            )
        }
        <p className="font-medium text-[15px]">
          {user.name} {user.last_name}
        </p>

        {isMe && (
          <div className="rounded bg-[#F4F7F9] px-2 py-1">
            <span className="text-xs font-medium">({t("you")})</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 min-w-0 items-center justify-between gap-2">
        <div className="flex flex-1 min-w-0 flex-col gap-2">
          <div>
            <RolSpan rol_id={user.rol_id} />
          </div>
          <div className="flex flex-1 min-w-0 items-center gap-2">
            <Mail
              size={14}
              className="translate-y-[0.5px] shrink-0 text-neutral-500"
            />
            <span className="truncate text-xs text-neutral-500">
              {user.email}
            </span>
          </div>
        </div>

        <UserDropdownActionButton
          user={user}
          isMe={isMe}
          branchId={branchId}
        />
      </div>
    </div>
  );
};

export default UsersCard;

interface RolSpanProps {
  rol_id: number | string;
}

export const RolSpan = ({ rol_id }: RolSpanProps) => {
  const t = useTranslations("UsersPage.roles");
  let label = "";
  let spanStyles = "";

  if (String(rol_id) === "1") {
    label = t("admin");
    spanStyles = "bg-[#EDE9FE] text-[#5B21B6] border-purple-200";
  } else if (String(rol_id) === "2") {
    label = t("manager");
    spanStyles = "bg-[#DBEAFE] text-[#1E40AF] border-blue-200";
  } else {
    label = t("cashier");
    spanStyles = "bg-[#CCFBF1] text-[#0F766E] border-teal-200";
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1 text-xs ${spanStyles}`}
    >
      <ShieldCheck size={14} className="shrink-0" />
      {label}
    </span>
  );
};
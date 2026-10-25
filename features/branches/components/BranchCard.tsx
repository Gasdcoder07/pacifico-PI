"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MoveRight, Phone, Pin } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPhoneNumber } from "@/shared/utils/formatters";
import { createSlug } from "@/shared/utils/create.slug";

interface BranchCardProps {
  id: string | number;
  name: string;
  managerName: string;
  managerPhoto: string;
  photo: string;
  status: boolean;
  direction: string;
  phone: string;
  email: string;
}

const MotionLink = motion.create(Link);

const BranchCard = ({ id, name, managerName, managerPhoto, photo, status, direction, phone, email }: BranchCardProps) => {
  const t = useTranslations("Branches.card");

  return (
    <div className="flex w-full gap-4 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
      <div className="relative w-2/5 shrink-0 overflow-hidden rounded-lg shadow">
        <img
          src={photo || 'default_branch.webp'}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex w-3/5 min-w-0 flex-col gap-2">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <h3 className="truncate text-lg font-bold tracking-wide text-neutral-900">
            {name}
          </h3>

          <StatusBadge status={status} />
        </div>

        <div className="flex min-w-0 items-center gap-4">
          <img
            src={managerPhoto || "/default_profile.webp"}
            alt={managerName}
            className="size-10 rounded-full border border-neutral-200 object-cover object-center shadow"
          />

          <div className="flex min-w-0 flex-col gap-0">
            {
                managerName ? (
                    <>
                        <p className="text-sm font-medium text-neutral-900">{managerName}</p>
                        <span className="text-xs text-neutral-400">{t("managerRole")}</span>
                    </>
                ) : (
                    <p className="text-sm font-medium text-neutral-900">
                        {t("noManager")}
                    </p>
                )
            }
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2 border-b border-neutral-200 pb-2 text-xs">
          <div className="flex flex-1 min-w-0 items-center gap-2 text-neutral-600">
            <Pin size={12} className="shrink-0" />
            <span className="line-clamp-2 wrap-break-word">{direction}</span>
          </div>

          <div className="flex flex-1 min-w-0 items-center gap-4 text-neutral-600">
            <div className="flex w-1/2 items-center gap-2">
              <Phone size={12} className="shrink-0" />
              <div className="flex w-full flex-1 min-w-0">
                <span className="truncate">{formatPhoneNumber(phone)}</span>
              </div>
            </div>

            <div className="flex w-1/2 items-center gap-2">
              <Mail size={12} className="shrink-0" />
              <div className="flex w-full flex-1 min-w-0">
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <MotionLink
            href={`/branch/${id}/${encodeURIComponent(createSlug(name))}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white sm:w-3/5"
          >
            <span>{t("viewDetails")}</span>
            <MoveRight size={20} className="shrink-0" />
          </MotionLink>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;

const StatusBadge = ({ status }: { status: boolean }) => {
  const t = useTranslations("Branches.card.status");
  const styles = status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";

  return (
    <span className={`${styles} rounded px-2 py-1 text-xs font-medium shadow`}>
      {status ? t("active") : t("inactive")}
    </span>
  );
};
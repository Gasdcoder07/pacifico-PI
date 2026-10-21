import { Metadata } from "next";
import BranchesStats from "@/features/branches/components/BranchesStats";
import BranchesContainer from "@/features/branches/components/BranchesContainer";

export const metadata: Metadata = {
  title: "Pacífico - Sucursales",
  description: "Gestiona tus sucursales",
};

export default function BranchesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
      <BranchesStats />
      <BranchesContainer />
    </div>
  );
}
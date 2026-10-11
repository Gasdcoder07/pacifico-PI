import BranchesStats from "@/features/branches/components/BranchesStats";
import BranchesContainer from "@/features/branches/components/BranchesContainer";

export default function Page() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
            <BranchesStats/>

            <BranchesContainer/>
        </div>
    );
}

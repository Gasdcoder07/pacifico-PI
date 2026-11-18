import BranchAccessGuard from "@/features/branch-details/components/BranchAccessGuard";
import BranchDetailsCard from "@/features/branch-details/components/BranchDetailsCard";
import BranchUsersContainer from "@/features/branch-details/components/BranchUsersContainer";

interface PageProps {
    params: Promise<{ id : string }>
}

const Page = async ({ params } : PageProps) => {
    const { id } = await params; 

    return (
        <BranchAccessGuard id={id}>
            <section className="flex min-h-full flex-col gap-8 p-8">
                <BranchDetailsCard id={id} />

                <BranchUsersContainer id={id} />
            </section>
        </BranchAccessGuard>
    )
};

export default Page;

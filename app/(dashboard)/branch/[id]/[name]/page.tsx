import BranchDetailsCard from "@/features/branch-details/components/BranchDetailsCard";
import BranchUsersCard from "@/features/branch-details/components/BranchUsersCard";

interface PageProps {
    params: Promise<{ id : string }>
}

const Page = async ({ params } : PageProps) => {
    const { id } = await params; 

    return (
        <section className="flex flex-col min-h-full p-8 gap-8">
            <BranchDetailsCard id={id}/>

            <BranchUsersCard/>
        </section>
    )
};

export default Page;

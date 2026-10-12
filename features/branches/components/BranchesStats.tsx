import TopBranchCard from "./TopBranchCard";
import TopBranchesCard from "./TopBranchesCard";

const BranchesStats = () => {
    return (
        <div className="flex items-center gap-8">
            <TopBranchCard
                isLoading={false}
                branch={null}/>

            <TopBranchesCard
                isLoading={false}
                branches={null}/>
        </div>
    );
};

export default BranchesStats;

import TopBranchCard from "./TopBranchCard";
import TopBranchesCard from "./TopBranchesCard";

const BranchesStats = () => {
    return (
        <div className="flex items-center gap-8">
            <TopBranchCard/>

            <TopBranchesCard/>
        </div>
    );
};

export default BranchesStats;

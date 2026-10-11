const TopBranchesCard = () => {
    return (
        <div className="w-2/5 border border-neutral-200 rounded-lg p-4 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xl text-neutral-900 font-bold">
                Top 3 Sucursales
            </h3>

            <div className="flex flex-col gap-2">
                <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="size-6 flex shrink-0 justify-center items-center rounded-full bg-amber-500 text-white font-bold text-xs">
                            1
                        </div>
                        <h4 className="text-neutral-900 font-semibold text-sm truncate">
                            Manzanillo
                        </h4>
                    </div>

                    <p className="text-sm font-bold text-neutral-900 shrink-0">
                        $128,000
                    </p>
                </div>

                <div className="bg-slate-500/10 border border-slate-500/20 p-2 rounded flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="size-6 flex shrink-0 justify-center items-center rounded-full bg-slate-500 text-white font-bold text-xs">
                            2
                        </div>
                        <h4 className="text-neutral-900 font-semibold text-sm truncate">
                            Las Brisas
                        </h4>
                    </div>

                    <p className="text-sm font-bold text-neutral-900 shrink-0">
                        $97,720
                    </p>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="size-6 flex shrink-0 justify-center items-center rounded-full bg-orange-600 text-white font-bold text-xs">
                            3
                        </div>
                        <h4 className="text-neutral-900 font-semibold text-sm truncate">
                            Valle de las Garzas
                        </h4>
                    </div>

                    <p className="text-sm font-bold text-neutral-900 shrink-0">
                        $72,190
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopBranchesCard;

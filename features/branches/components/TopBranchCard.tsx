import { Trophy } from "lucide-react";

const TopBranchCard = () => {
    return (
        <div className="relative w-3/5 overflow-hidden rounded-lg text-white shadow-sm flex items-center p-6">
            <div className="absolute z-10 -bottom-12 -left-12 size-48 rounded-full bg-cyan-300/40 blur-2xl pointer-events-none" />
            <div className="absolute z-10 -bottom-10 left-1/3 size-52 rounded-full bg-cyan-300/60 blur-3xl pointer-events-none" />
            <div className="absolute z-10 -top-12 -left-6 size-40 rounded-full bg-cyan-300/60 blur-2xl pointer-events-none" />

            <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                alt="Sucursal"
                className="absolute right-0 top-0 h-full w-3/5 object-cover object-center"
            />

            <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path
                    className="fill-cyan-500/10"
                    d="M 0,0 L 73,0 C 85,35 58,65 77,100 L 0,100 Z"
                />
            </svg>

            <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path
                    fill="#00b8db"
                    d="M 0,0 L 65,0 C 79,35 52,65 70,100 L 0,100 Z"
                />
            </svg>

            <div className="relative z-10 flex flex-col justify-between max-w-3/4 gap-4">
                <h2 className="text-xl font-bold tracking-tight drop-shadow-sm">
                    Sucursal con mejores ganancias
                </h2>

                <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20 border border-white/20 shadow-inner">
                        <Trophy size={24} className="text-yellow-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-xl leading-relaxed drop-shadow-sm">
                            Sucursal Manzanillo
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-4xl font-black drop-shadow-sm">
                        $128,000
                    </span>
                    <span className="text-sm font-medium">
                        en ganancias totales
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TopBranchCard;

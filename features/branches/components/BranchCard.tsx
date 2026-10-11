import { Phone, Pin } from "lucide-react";
import BranchDropdownActionButton from "@/features/branches/components/BranchDropdownActionButton";

interface BranchCardProps {
    branch_profile_picture: string;
    branch_name: string;
    branch_status: boolean;
    branch_manager_name: string;
    branch_address: string;
    branch_phone: string;
}

const BranchCard = (props: BranchCardProps) => {
    return (
        <div className="min-w-md flex gap-4 p-2 rounded-lg border border-neutral-200 shadow-sm">
            <div className="relative w-2/5 shrink-0 rounded-lg overflow-hidden shadow">
                <img
                    src="https://cdn.aglty.io/scotia-bank-mexico/Attachments/NewItems/lomas-palmas-sucursal_20231018233625_0.png"
                    alt="Branch"
                    className=" absolute inset-0 h-full w-full object-cover"
                />
            </div>

            <div className="w-3/5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-neutral-900 tracking-wide">
                        Las Brisas
                    </h3>

                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium shadow">
                        Activa
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <img
                        src="https://i.pinimg.com/originals/38/43/28/38432891e9e320c7ac514c8e815f2947.jpg"
                        alt="Gerente"
                        className="size-10 object-center rounded-full border border-neutral-200 shadow"
                    />

                    <div className="flex flex-col gap-0">
                        <p className="font-medium text-neutral-900 text-sm">
                            Juan Pérez
                        </p>
                        <span className="text-xs text-neutral-400">
                            Gerente
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 text-xs border-b border-neutral-200 pb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0 text-neutral-600">
                        <Pin
                            size={12}
                            className="shrink-0 translate-y-[0.5px]"
                        />
                        <span className="truncate">
                            Av. Reforma 123, Ciudad de México
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 min-w-0 text-neutral-600">
                        <Phone
                            size={12}
                            className="shrink-0 translate-y-[0.5px]"
                        />
                        <span className="truncate">55-1234-5678</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors ease-in-out duration-200 cursor-pointer">
                        Ver detalles
                    </button>

                    <BranchDropdownActionButton />
                </div>
            </div>
        </div>
    );
};

export default BranchCard;

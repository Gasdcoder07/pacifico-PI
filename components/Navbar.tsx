import ProfilePfp from "./ProfilePfp";

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-neutral-300">
            <div className="mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center gap-4">
                    <img
                        src="https://cdn.aglty.io/scotia-bank-mexico/Attachments/NewItems/lomas-palmas-sucursal_20231018233625_0.png"
                        className="w-10 h-auto shrink-0 object-contain rounded-md"
                        alt="Sucursal"/>

                    <div className="flex flex-col">
                        <p className="text-neutral-500 text-xs font-medium whitespace-nowrap">Sucursal</p>
                        <p className="text-sm font-semibold whitespace-nowrap">Las Brisas</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ProfilePfp name="Valentín" role="Papu :V" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

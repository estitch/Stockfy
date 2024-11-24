
const InventoryLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-gray-300 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 text-sm font-semibold">
                    Cargando...
                </div>
            </div>
        </div>
    );
};

export default InventoryLoader;

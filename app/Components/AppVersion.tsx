const AppVersion = () => {
    return (
        <div className="fixed bottom-2 left-2">
            <div className="hidden sm:block text-center text-[10px] text-gray-500">
                v.{process.env.APP_VERSION}
            </div>
        </div>
    );
}
export default AppVersion;
export default function Divider({dividerText, className = ""}) {
    return (
        <div className={`flex items-center w-full ${className}`}>
            <div className="flex-1 border-t border-gray-300"/>
            <span className="mx-4 text-gray-400">{dividerText}</span>
            <div className="flex-1 border-t border-gray-300"/>
        </div>
    );
}

import React from 'react';

interface ToolbarProps {
    onFileUpload: (file: File) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    zoomLevel: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onFileUpload, onZoomIn, onZoomOut, zoomLevel }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
            <div className="flex items-center space-x-4">
                <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                    Open Score
                    <input
                        type="file"
                        accept=".mscz,.xml,.musicxml"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onZoomOut}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                    -
                </button>
                <span className="w-16 text-center">{(zoomLevel * 100).toFixed(0)}%</span>
                <button
                    onClick={onZoomIn}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                    +
                </button>
            </div>
        </div>
    );
};

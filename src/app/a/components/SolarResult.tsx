import React from 'react';

interface SolarResultProps {
    data: {
        calculation_time: string;
        apparent_zenith: number;
        apparent_elevation: number;
        azimuth: number;
        latitude: number;
        longitude: number;
        elevation: number;
    } | null;
}

export default function SolarResult({ data }: SolarResultProps) {
    if (!data) return null;

    return (
        <div className="mt-8 w-full animate-fade-in-up">
            <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                    Solar Position Result
                    <span className="text-sm font-normal text-gray-500 ml-auto">{data.calculation_time}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Azimuth Card */}
                    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-sm">Azimuth</h4>

                        {/* Compass Icon */}
                        <div className="relative w-32 h-32 mb-4">
                            {/* Compass Circle */}
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200 bg-white shadow-inner flex items-center justify-center">
                                <span className="absolute top-1 text-xs font-bold text-gray-400">N</span>
                                <span className="absolute right-2 text-xs font-bold text-gray-400">E</span>
                                <span className="absolute bottom-1 text-xs font-bold text-gray-400">S</span>
                                <span className="absolute left-2 text-xs font-bold text-gray-400">W</span>
                            </div>

                            {/* Rotating Needle/Indicator */}
                            <div
                                className="absolute inset-0 transition-transform duration-1000 ease-out"
                                style={{ transform: `rotate(${data.azimuth}deg)` }}
                            >
                                <div className="w-full h-full flex justify-center">
                                    {/* Arrow */}
                                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[40px] border-b-red-500 mt-2 filter drop-shadow-md"></div>
                                </div>
                            </div>

                            {/* Center Dot */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-gray-800 rounded-full border-2 border-white shadow-md z-10"></div>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-800">
                            {Math.round(data.azimuth)}°
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Compass Direction</p>
                    </div>

                    {/* Elevation Card */}
                    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-sm">Elevation</h4>

                        {/* Angle Icon */}
                        <div className="relative w-32 h-32 mb-4 flex items-end justify-center pb-2">
                            {/* Ground Line */}
                            <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-300 rounded-full"></div>

                            {/* Protractor Arc (Simplified) */}
                            <div className="absolute bottom-2 left-4 w-24 h-24 border-t-2 border-r-2 border-l-2 border-gray-200 rounded-t-full opacity-50"></div>

                            {/* Sun Icon on Arm */}
                            <div
                                className="absolute bottom-2 left-1/2 w-[120px] h-1 bg-transparent origin-left transition-transform duration-1000 ease-out flex items-center"
                                style={{ transform: `rotate(-${data.apparent_elevation}deg)` }}
                            >
                                {/* Ray Line */}
                                <div className="w-full h-0.5 bg-amber-400/50 dashed"></div>

                                {/* Sun */}
                                <div className="absolute right-0 w-8 h-8 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)] flex items-center justify-center border-2 border-white">
                                    <div className="w-4 h-4 bg-amber-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* Angle Text Overlay */}
                            <div className="absolute bottom-8 left-16 text-xs font-bold text-amber-600">
                                {Math.round(data.apparent_elevation)}°
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-800">
                            {Math.round(data.apparent_elevation)}°
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Above Horizon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

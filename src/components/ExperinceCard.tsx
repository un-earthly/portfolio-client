'use client'
import { Briefcase, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";

export default function ExperienceCard({ company }: any) {
    const [isExpanded, setIsExpanded] = useState(false);
    const truncateText = (text: any, maxLength: any) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    };
    return (
        <Card
            className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {company.companyLogo ? (
                            <img
                                src={company.companyLogo}
                                alt={`${company.company} logo`}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                            />
                        ) : (
                            <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                                <Briefcase className="h-5 w-5 text-cyan-400" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-100">{company.company}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>{company.duration}</span>
                                <span>•</span>
                                <span>{company.type}</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{company.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10">
                <div className="space-y-4">
                    {company.positions.map((position: any, posIndex: any) => (
                        <div key={posIndex} className="pl-4 border-l-2 border-slate-800">
                            <div className="flex items-center gap-2 text-gray-200">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 absolute -ml-5" />
                                <h4 className="font-medium">{position.title}</h4>
                                <span className="text-sm text-gray-400">• {position.duration}</span>
                            </div>

                        </div>
                    ))}
                </div>
                {company.description && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-400 whitespace-pre-line">
                            {isExpanded
                                ? company.description
                                : truncateText(company.description, 100)
                            }
                        </p>
                        {company.description.length > 100 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-sm text-cyan-400 hover:text-cyan-300 mt-1 focus:outline-none"
                            >
                                {isExpanded ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
            {
                company.keyTechnologies && <CardFooter>
                    <div className="space-y-2">
                        <p className="text-gray-300 text-sm">
                            Key Technologies Used
                        </p>
                        <div className="gap-2 flex flex-wrap">
                            {company.keyTechnologies.map((e: any) => <Badge
                                key={e}
                                variant="default"
                                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 transition-colors"
                            >
                                {e}
                            </Badge>)}
                        </div>
                    </div>
                </CardFooter>}
            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
        </Card>
    )
}
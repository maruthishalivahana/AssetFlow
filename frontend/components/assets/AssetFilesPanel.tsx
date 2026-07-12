"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import assetService from "@/src/services/asset.service";

interface AssetFile {
    id: string;
    fileName: string;
    filePath: string;
    mimeType?: string;
}

interface Props {
    files?: AssetFile[];
}

export const AssetFilesPanel: React.FC<Props> = ({ files = [] }) => {
    if (!files || files.length === 0) return null;

    return (
        <section className="mt-4">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Files & Documents</h4>
            <div className="space-y-2">
                {files.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-3 bg-[#090909] border border-[#262626] rounded-md p-3">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <div>
                                <div className="text-sm text-slate-100">{f.fileName}</div>
                                <div className="text-xs text-slate-500">{f.mimeType || 'file'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={assetService.getDownloadUrl(f.filePath)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2"
                            >
                                <Button variant="outline" className="bg-transparent border-[#262626] text-slate-200">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AssetFilesPanel;

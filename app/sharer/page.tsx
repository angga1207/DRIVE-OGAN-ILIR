import { Suspense } from "react";
import { Metadata } from "next";
import SharerClient from "./SharerClient";

// Generate dynamic metadata
export async function generateMetadata({
    searchParams
}: {
    searchParams: Promise<{ _id?: string }>
}): Promise<Metadata> {
    const params = await searchParams;
    const defaultMetadata = {
        title: 'DRIVE OGAN ILIR - Berbagi File',
        description: 'Akses file dan folder yang dibagikan melalui DRIVE OGAN ILIR',
        openGraph: {
            title: 'DRIVE OGAN ILIR - Berbagi File',
            description: 'Akses file dan folder yang dibagikan melalui DRIVE OGAN ILIR',
        },
    };

    if (!params._id) {
        return defaultMetadata;
    }

    try {
        // Fetch data untuk mendapatkan nama folder/file
        const apiUrl = process.env.NODE_ENV === 'production'
            ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://drive.oganilirkab.go.id'}/api/publicPath`
            : 'http://localhost:3000/api/publicPath';

        const response = await fetch(`${apiUrl}?slug=${params._id}`, {
            cache: 'no-store',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success' && data.data?.current?.name) {
                const itemName = data.data.current.name;
                const itemType = data.data.current.type === 'folder' ? 'Folder' : 'File';

                return {
                    title: `${itemName} - DRIVE OGAN ILIR`,
                    description: `${itemType} ${itemName} dibagikan melalui DRIVE OGAN ILIR. Akses file dan folder yang telah dibagikan.`,
                    openGraph: {
                        title: `${itemName} - DRIVE OGAN ILIR`,
                        description: `${itemType} ${itemName} dibagikan melalui DRIVE OGAN ILIR. Akses file dan folder yang telah dibagikan.`,
                        type: 'website',
                    },
                    twitter: {
                        card: 'summary',
                        title: `${itemName} - DRIVE OGAN ILIR`,
                        description: `${itemType} ${itemName} dibagikan melalui DRIVE OGAN ILIR`,
                    },
                };
            }
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return defaultMetadata;
}

export default function SharerPage({
    searchParams
}: {
    searchParams: Promise<{ _id?: string }>
}) {
    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
            <SharerClient />
        </Suspense>
    );
}



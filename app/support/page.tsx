import { Metadata } from "next";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Pusat Bantuan - DRIVE OGAN ILIR",
    description: "Hubungi kami untuk bantuan dan dukungan teknis DRIVE OGAN ILIR. Tim support siap membantu Anda.",
    openGraph: {
        title: "Pusat Bantuan - DRIVE OGAN ILIR",
        description: "Hubungi kami untuk bantuan dan dukungan teknis DRIVE OGAN ILIR. Tim support siap membantu Anda.",
        type: "website",
    },
};

export default function SupportPage() {
    const contactInfo = [
        {
            icon: PhoneIcon,
            title: "WhatsApp",
            value: "+62 812-5533-2004",
            href: "https://wa.me/6281255332004",
            description: "Chat langsung untuk bantuan cepat"
        },
        {
            icon: EnvelopeIcon,
            title: "Email",
            value: "diskominfo@oganilirkab.go.id",
            href: "mailto:diskominfo@oganilirkab.go.id",
            description: "Kirim email untuk pertanyaan detail"
        },
        {
            icon: MapPinIcon,
            title: "Alamat",
            value: "Jl. Lintas Sumatra, Indralaya Raya, Kec. Indralaya, Kabupaten Ogan Ilir, Sumatera Selatan 30862",
            href: "https://maps.google.com/?q=Jl.+Lintas+Sumatra,+Indralaya+Raya,+Kec.+Indralaya,+Kabupaten+Ogan+Ilir,+Sumatera+Selatan+30862",
            description: "Kunjungi kantor kami"
        }
    ];

    const faqItems = [
        {
            question: "Bagaimana cara mengupload file?",
            answer: "Anda dapat mengupload file dengan mengklik tombol 'Upload' di dashboard, pilih file yang ingin diupload, lalu klik 'Upload File'."
        },
        {
            question: "Bagaimana cara berbagi file atau folder?",
            answer: "Klik kanan pada file atau folder yang ingin dibagikan, pilih 'Share', atur pengaturan privasi, dan salin link untuk dibagikan."
        },
        {
            question: "Apa batas maksimal ukuran file?",
            answer: "Ukuran maksimal file yang dapat diupload tergantung pada pengaturan administrator sistem."
        },
        {
            question: "Bagaimana cara memulihkan file yang terhapus?",
            answer: "File yang terhapus akan masuk ke folder 'Trash'. Anda dapat memulihkannya dengan masuk ke halaman Trash dan klik 'Restore'."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#003a69] mb-4">
                        Pusat Bantuan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Kami siap membantu Anda dengan segala pertanyaan dan kendala teknis
                        yang Anda hadapi saat menggunakan DRIVE OGAN ILIR
                    </p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                            Hubungi Kami
                        </h2>
                        <div className="space-y-6">
                            {contactInfo.map((contact, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-[#003a69] rounded-lg flex items-center justify-center">
                                                <contact.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {contact.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {contact.description}
                                            </p>
                                            {contact.href ? (
                                                <Link
                                                    href={contact.href}
                                                    target={contact.title === "Alamat" ? "_blank" : undefined}
                                                    className="text-[#003a69] hover:text-[#ebbd18] font-medium transition-colors duration-300 break-all"
                                                >
                                                    {contact.value}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-800 break-all">
                                                    {contact.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                            Pertanyaan Umum
                        </h2>
                        <div className="space-y-4">
                            {faqItems.map((faq, index) => (
                                <details key={index} className="bg-white rounded-lg shadow-md">
                                    <summary className="p-6 cursor-pointer hover:bg-gray-50 rounded-lg font-semibold text-gray-900 border-b border-gray-200">
                                        {faq.question}
                                    </summary>
                                    <div className="p-6 pt-0">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#003a69] rounded-lg shadow-xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Butuh Bantuan Segera?
                    </h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Tim support kami siap membantu Anda mengatasi kendala teknis dan menjawab
                        pertanyaan seputar penggunaan DRIVE OGAN ILIR
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="https://wa.me/6281255332004"
                            target="_blank"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#003a69] bg-white hover:bg-gray-50 transition-colors duration-300"
                        >
                            <PhoneIcon className="w-5 h-5 mr-2" />
                            Chat WhatsApp
                        </Link>
                        <Link
                            href="mailto:diskominfo@oganilirkab.go.id"
                            className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-[#003a69] transition-colors duration-300"
                        >
                            <EnvelopeIcon className="w-5 h-5 mr-2" />
                            Kirim Email
                        </Link>
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="text-center mt-12">
                    <Link
                        href="/login"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#003a69] hover:bg-[#ebbd18] hover:text-[#003a69] transition-colors duration-300"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
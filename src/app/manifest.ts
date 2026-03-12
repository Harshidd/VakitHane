import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'VakitHane – Zamanlayıcı & Sayaç',
        short_name: 'VakitHane',
        description: 'Online zamanlayıcı, sınav geri sayım, namaz vakitleri, iftar sayacı ve meditasyon.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0d0e14',
        theme_color: '#0d0e14',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}

import type { Metadata, Viewport } from 'next'
import {
  Geist,
  Space_Grotesk,
  Plus_Jakarta_Sans,
  Nunito,
  Bebas_Neue,
  IBM_Plex_Mono,
} from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { ThemePicker } from '@/components/ThemePicker'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'] })
const plusJakarta = Plus_Jakarta_Sans({ variable: '--font-plus-jakarta', subsets: ['latin'] })
const nunito = Nunito({ variable: '--font-nunito', subsets: ['latin'] })
const bebasNeue = Bebas_Neue({ variable: '--font-bebas-neue', weight: '400', subsets: ['latin'] })
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TeenImposter',
  description: 'The social deduction word game made for teens.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'TeenImposter',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const fontVars = [
  geist.variable,
  spaceGrotesk.variable,
  plusJakarta.variable,
  nunito.variable,
  bebasNeue.variable,
  ibmPlexMono.variable,
].join(' ')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVars}>
      <head>
        {/* Prevent theme flash by reading localStorage before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('teenimposter-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-dvh">
        <Providers>
          <ThemePicker />
          {children}
        </Providers>
      </body>
    </html>
  )
}

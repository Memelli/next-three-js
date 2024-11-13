export default function CreateCharacterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="w-full h-screen">{children}</main>
}
